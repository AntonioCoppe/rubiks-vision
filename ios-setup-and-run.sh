#!/usr/bin/env bash
set -e

echo "🌱 1) Re-generating the iOS project…"
npx expo prebuild --platform ios

echo "📋 2) Creating the two .xcfilelist files…"
cat <<EOF > ios/ExpoConfigureProject.inputs.xcfilelist
\$(PODS_ROOT)/Target Support Files/Pods-\$(PRODUCT_NAME:rfc1034identifier)/expo-configure-project.sh
\$(PROJECT_DIR)/../app.json
\$(PROJECT_DIR)/../package.json
\$(PROJECT_DIR)/Podfile.lock
EOF

cat <<EOF > ios/ExpoConfigureProject.outputs.xcfilelist
\$(DERIVED_FILE_DIR)/expo-configure-project.done
EOF

chmod 644 ios/ExpoConfigureProject.inputs.xcfilelist ios/ExpoConfigureProject.outputs.xcfilelist
echo "   → Created .xcfilelist files"

echo "💎 3) Installing xcodeproj gem locally…"
gem install --user-install xcodeproj
# ensure your user-gem bin is on $PATH:
export PATH="$HOME/.gem/ruby/$(ls ~/.gem/ruby)/bin:$PATH"

echo "🔧 4) Patching your .xcodeproj to wire in those file lists…"
cat <<'RUBY' > patch_xcodeproj.rb
#!/usr/bin/env ruby
require 'xcodeproj'

# 1) find your .xcodeproj under ios/
proj_dir = Dir.glob("ios/*.xcodeproj").first
abort "❌ No .xcodeproj found in ios/" unless proj_dir

# 2) open it and find your RubiksVision target
proj   = Xcodeproj::Project.open(proj_dir)
target = proj.targets.find { |t| t.name == 'RubiksVision' }
abort "❌ Target 'RubiksVision' not found in #{proj_dir}" unless target

# 3) locate the "[Expo] Configure project" run-script phase
phase = target.shell_script_build_phases.find do |ph|
  ph.shell_script.include?('expo-configure-project.sh')
end
# <-- notice we switched to single-quotes here so Ruby isn't tripped up by inner quotes
abort '❌ Cannot find the "expo-configure-project.sh" script phase' unless phase

# 4) point it at your .xcfilelist files
phase.input_file_list_paths  = ['$(PROJECT_DIR)/ExpoConfigureProject.inputs.xcfilelist']
phase.output_file_list_paths = ['$(PROJECT_DIR)/ExpoConfigureProject.outputs.xcfilelist']

# 5) save and report success
proj.save
puts "✅ Successfully patched #{proj_dir}"
RUBY

chmod +x patch_xcodeproj.rb
ruby patch_xcodeproj.rb

echo "🚀 5) Building & installing to your device…"
npx expo run:ios --device 