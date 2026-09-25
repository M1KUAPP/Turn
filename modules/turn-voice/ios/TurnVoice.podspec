Pod::Spec.new do |s|
  s.name = 'TurnVoice'
  s.version = '0.1.0'
  s.summary = 'Personal Voice access for Turn'
  s.description = 'Requests Personal Voice authorization and observes available voices.'
  s.license = { :type => 'MIT' }
  s.author = 'Turn'
  s.homepage = 'https://github.com/RevenueCat-M1KU/RevenueCat'
  s.source = { :git => 'https://github.com/RevenueCat-M1KU/RevenueCat.git', :tag => s.version.to_s }
  s.platform = :ios, '17.0'
  s.swift_version = '5.9'
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = "**/*.{h,m,mm,swift}"
end
