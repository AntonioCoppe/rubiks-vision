#!/usr/bin/env ruby
require 'xcodeproj'

project_path = 'ios/RubiksVision.xcodeproj'
abort "❌ Couldn’t find #{project_path}" unless File.directory?(project_path)

proj   = Xcodeproj::Project.open(project_path)
target = proj.targets.find { |t| t.name == 'RubiksVision' }
abort "❌ Target RubiksVision not in #{project_path}" unless target

phase = target.shell_script_build_phases.find do |ph|
  ph.shell_script.include?('expo-configure-project.sh')
end
abort "❌ No “[Expo] Configure project” phase found" unless phase

phase.input_file_list_paths  = ['$(PROJECT_DIR)/ExpoConfigureProject.inputs.xcfilelist']
phase.output_file_list_paths = ['$(PROJECT_DIR)/ExpoConfigureProject.outputs.xcfilelist']

proj.save
puts "✅ Wired up .xcfilelists into #{project_path}"
