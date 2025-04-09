import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
//import * as Animated from 'react-native-reanimated';
import {
  useSharedValue,
  useDerivedValue,
  interpolateColor,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
//import createAnimatedComponent from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Reanimated from 'react-native-reanimated';

const { createAnimatedComponent } = Reanimated;

const AnimatedView = createAnimatedComponent(View);

// Fix TypeScript error for JSX: wrap LinearGradient as valid JSX componentnpm ls react-native-reanimated
const SafeLinearGradient = LinearGradient as unknown as React.ComponentType<any>;

const gradientSets = [
  ['#a1c4fd', '#c2e9fb'],
  ['#d4fc79', '#96e6a1'],
  ['#ffbec3', '#c1424c'],
] as const;

type GradientTuple = (typeof gradientSets)[number];

export default function MoodCheckScreen() {
  const progress = useSharedValue(0);
  const colorSetIndex = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 4000 }), -1, true);

    const interval = setInterval(() => {
      colorSetIndex.value = (colorSetIndex.value + 1) % gradientSets.length;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const animatedColors = useDerivedValue<GradientTuple>(() => {
    const current = gradientSets[colorSetIndex.value];
    const next = gradientSets[(colorSetIndex.value + 1) % gradientSets.length];

    const color1 = interpolateColor(progress.value, [0, 1], [current[0], next[0]]);
    const color2 = interpolateColor(progress.value, [0, 1], [current[1], next[1]]);

    return [color1, color2] as GradientTuple;
  });

  const interpolatedColors = animatedColors.value as [string, string];

  const animatedStyle = Animated.useAnimatedStyle(() => {
    return {
      opacity: withTiming(1), // can animate more props here
    };
  });

  const handleSelectMood = (mood: string) => {
    router.replace('/MoodTabs');
  };

  return (
    <View style={styles.container}>
      <AnimatedView style={[StyleSheet.absoluteFill, animatedStyle]}>
        <SafeLinearGradient
          colors={interpolatedColors}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0.2 }}
          end={{ x: 0.9, y: 1 }}
        />
      </AnimatedView>

      <Text style={styles.title}>How are you feeling today?</Text>
      <Pressable style={styles.button} onPress={() => handleSelectMood('focused')}>
        <Text style={styles.buttonText}>🧠 Focused</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => handleSelectMood('mellow')}>
        <Text style={styles.buttonText}>🌈 Mellow</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => handleSelectMood('listen')}>
        <Text style={styles.buttonText}>🎧 Ready to Listen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});
