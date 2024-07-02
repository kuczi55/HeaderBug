import React, {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
  AppState,
  AppStateStatus,
  Button,
} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ParamListBase,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {GestureDetectorProvider} from 'react-native-screens/gesture-handler';

interface ScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const ScreenWithHeader = ({navigation}: ScreenProps): React.JSX.Element => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        testID="stack-presentation-screen-with-header-1"
        title="Push"
        onPress={() => navigation.push('Push')}
      />
      <Button
        testID="stack-presentation-form-screen-push-modal-1"
        title="Open modal"
        onPress={() => navigation.push('Modal')}
      />
      <Button
        testID="stack-presentation-screen-without-header-1"
        title="Push without header"
        onPress={() => navigation.push('PushWithoutHeader')}
      />
      {navigation.canGoBack() && (
        <Button
          testID="stack-presentation-screen-go-back-button-1"
          title="Go back"
          onPress={navigation.goBack}
        />
      )}
    </ScrollView>
  );
};

const ScreenWithoutHeader = ({navigation}: ScreenProps): React.JSX.Element => {
  return (
    // for some reason when we set paddingTop or marginTop, the bug doesn't occur
    // during theme change (but still occurs when we background the app and come back)
    // <ScrollView contentContainerStyle={[styles.container, styles.noHeader]}>
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        testID="stack-presentation-screen-with-header-2"
        title="Push"
        onPress={() => navigation.push('Push')}
      />
      <Button
        testID="stack-presentation-form-screen-push-modal-2"
        title="Open modal"
        onPress={() => navigation.push('Modal')}
      />
      <Button
        testID="stack-presentation-screen-without-header-2"
        title="Push without header"
        onPress={() => navigation.push('PushWithoutHeader')}
      />
      {navigation.canGoBack() && (
        <Button
          testID="stack-presentation-screen-go-back-button-2"
          title="Go back"
          onPress={navigation.goBack}
        />
      )}
    </ScrollView>
  );
};

interface ModalScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const ModalScreen = ({navigation}: ModalScreenProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Button
        testID="stack-presentation-modal-screen-go-back-button"
        title="Go back"
        onPress={navigation.goBack}
      />
    </View>
  );
};

const Stack = createNativeStackNavigator();

let lastState: AppStateStatus;

const ExampleApp = (): React.JSX.Element => {
  const [counter, setCounter] = useState(0);
  const handleChange = useCallback((nextState: AppStateStatus) => {
    if (nextState === 'active' && lastState === 'background') {
      setCounter(c => c + 1);
    }
    lastState = nextState;
  }, []);

  useEffect(() => {
    const listener = AppState.addEventListener('change', handleChange);
    handleChange(AppState.currentState);
    return () => {
      listener.remove();
    };
  }, [handleChange]);

  const theme = useColorScheme();

  return (
    <GestureHandlerRootView style={styles.flexOne}>
      <GestureDetectorProvider>
        <NavigationContainer
          theme={theme === 'light' ? DefaultTheme : DarkTheme}>
          <Stack.Navigator>
            <Stack.Screen
              name="Push"
              component={ScreenWithHeader}
              options={{
                presentation: 'card',
                title: `header ${counter}`,
              }}
            />
            <Stack.Screen
              name="PushWithoutHeader"
              component={ScreenWithoutHeader}
              options={{
                presentation: 'card',
                headerShown: false,
                title: 'no header',
              }}
            />
            <Stack.Screen
              key={'Modal'}
              name="Modal"
              component={ModalScreen}
              options={{
                presentation: 'modal',
                orientation: 'portrait_up',
                title: 'modal',
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureDetectorProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  noHeader: {
    paddingTop: 50,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  flexOne: {
    flex: 1,
  },
});

export default ExampleApp;
