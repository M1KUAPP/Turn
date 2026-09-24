Pod::Spec.new do |s|
  s.name = 'TurnListen'
  s.version = '0.1.0'
  s.summary = 'On-device name finding for Turn'
  s.description = 'Uses NaturalLanguage to find names in partner lines and the phrase bank.'
  s.license = { :type => 'MIT' }
  s.author = 'Turn'
  s.homepage = 'https://github.com/RevenueCat-M1KU/RevenueCat'
  s.source = { :git => 'https://github.com/RevenueCat-M1KU/RevenueCat.git', :tag => s.version.to_s }
  s.platform = :ios, '16.4'
  s.swift_version = '5.9'
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = "**/*.{h,m,mm,swift}"
end
