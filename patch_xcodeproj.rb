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
