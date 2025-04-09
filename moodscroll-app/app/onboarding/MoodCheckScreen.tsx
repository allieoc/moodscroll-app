import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const gradientSets = [
  ['#a1c4fd', '#c2e9fb'],
  ['#d4fc79', '#96e6a1'],
  ['#ffbec3', '#c1424c'],
] as const;

type GradientTuple = (typeof gradientSets)[number];

export default function MoodCheckScreen() {
  const progress = useSharedValue(0);
  const colorSetIndex = useSharedValue(0);
  const [animatedColors, setAnimatedColors] = useState<GradientTuple>(gradientSets[0]);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 4000 }), -1, true);

    const interval = setInterval(() => {
      const nextIndex = (colorSetIndex.value + 1) % gradientSets.length;
      colorSetIndex.value = nextIndex;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const current = gradientSets[colorSetIndex.value];
    const next = gradientSets[(colorSetIndex.value + 1) % gradientSets.length];

    const color1 = interpolateColor(progress.value, [0, 1], [current[0], next[0]]);
    const color2 = interpolateColor(progress.value, [0, 1], [current[1], next[1]]);

    // Use useState to safely update visible gradient in sync with animation
    setAnimatedColors([color1, color2] as GradientTuple);

    return {
      backgroundColor: 'transparent', // optional styling
    };
  });

  const handleSelectMood = (mood: string) => {
    router.replace('/MoodTabs');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={animatedColors}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0.2 }}
          end={{ x: 0.9, y: 1 }}
        />
      </Animated.View>

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
