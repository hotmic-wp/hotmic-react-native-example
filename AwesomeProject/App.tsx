import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  NativeModules,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [streams, setStreams] = useState([]);
  const [streamsError, setStreamsError] = useState(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  //hardcoded test ApiKey and ApiToken
  const hotMicApiKey = 'ac3daec7-1b61-456e-93f4-53f8b1e222ce';
  const hotMicApiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6eyJ1c2VyX2lkIjoiM2Q1NTY3YzItNjAzYy00YjA4LWI5MTctN2U5ZjA1YzhlYmI1IiwiZGlzcGxheV9uYW1lIjoidGVzdGVyMSIsInByb2ZpbGVfcGljIjoiaHR0cHM6Ly91aS1hdmF0YXJzLmNvbS9hcGkvP25hbWU9dGVzdCZiYWNrZ3JvdW5kPTBEQ0FENiZjb2xvcj1mZmYiLCJiYWRnZSI6Imh0dHBzOi8vaG90bWljLWNvbnRlbnQuczMudXMtd2VzdC0xLmFtYXpvbmF3cy5jb20vYmFkZ2VzLzEwX2JhZGdlLnBuZz9jMjUxZmVjZS1jMDhmLTQ4YTAtOTMxZS03MGNmZThlYTdlZDQifSwiaWF0IjoxNjU3NjU4NTU1LCJleHAiOjE4MjE3MjQwMTR9.0tuBRyMDRYj_J6ZOQe53_0jcBKqY5w4pv44O0rgSZqQ';

  useEffect(() => {
    setTimeout(() => {
      if (NativeModules.HotMicMediaPlayerBridge) {
        console.log('NativeModules info:', NativeModules.HotMicMediaPlayerBridge);
        try {
          NativeModules.HotMicMediaPlayerBridge.initialize(hotMicApiKey, hotMicApiToken);
          console.log('NativeModules.HotMicMediaPlayerBridge.initialize() called, now calling getStreams()');

          NativeModules.HotMicMediaPlayerBridge.getStreams(
            //hardcoded user for testing
            "6d2fe7b0-eacb-46e9-82ee-7ff6eb3ab7f8",
            100,
            0
          ).then((streamsData) => {
            console.log('getStreams Success:', streamsData);
            setStreams(streamsData);
          }).catch((error) => {
            console.error('getStreams Error:', error);
            setStreamsError(error);
          });                

        } catch (error) {
          console.error('Error while calling native methods:', error);
        }
      } else {
        console.log("HotMicMediaPlayerBridge is not ready yet");
      }
    }, 1000);
  }, []);
  

  console.log('App component is returning');
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Text style={styles.sectionTitle}>Welcome to HotMic</Text>

        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {
            // Check if all elements in streams are null or if streams is empty
            streams.every(stream => stream === null) ? (
              <Text>No streams available.</Text>
            ) : (
              streams.map((stream, index) => (
                stream && (
                  <View key={index} style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Stream {index + 1}</Text>

                    <Text 
                      style={styles.sectionDescription}
                      onPress={() => {
                        if (NativeModules.HotMicMediaPlayerBridge) {
                          console.log('NativeModules.HotMicMediaPlayerBridge.showPlayer() called');
                          NativeModules.HotMicMediaPlayerBridge.showPlayer(stream.id)
                          .then((response) => console.log(response))
                          .catch((error) => console.error('Failed to show player:', error));
                      
                        }
                      }}
                    >
                      Title: {stream.title}
                    </Text>

                  </View>
                )
              ))
            )
          }
          {streamsError && <Text>Error: {streamsError}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
