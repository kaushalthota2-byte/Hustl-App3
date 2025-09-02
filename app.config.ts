import { ExpoConfig } from 'expo/config';

export default (): ExpoConfig => ({
  expo: {
    name: "bolt-expo-nativewind",
    slug: "bolt-expo-nativewind",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    jsEngine: "jsc",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.hustl.app",
      jsEngine: "jsc",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "We use your location to show nearby tasks on the map.",
        LSApplicationQueriesSchemes: ["comgooglemaps"]
      }
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./src/assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      ["expo-location", {
        locationAlwaysAndWhenInUseUsageDescription: "We use your location to show nearby tasks on the map."
      }]
    ],
    experiments: {
      typedRoutes: true
    }
  }
});