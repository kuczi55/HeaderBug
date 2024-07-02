import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  CommonActions,
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRef,
  ParamListBase,
  StackActions,
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

let uuidCount: number = 0;

function generateKey(): string {
  return `push-${uuidCount++}`;
}

const ScreenWithHeader = ({navigation}: ScreenProps): React.JSX.Element => {
  const topLevelNavigation = useContext(NavigationContext);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        testID="stack-presentation-screen-with-header-1"
        title="Push"
        onPress={() => topLevelNavigation?.dispatch(StackActions.push('Push'))}
      />
      <Button
        testID="stack-presentation-form-screen-push-modal-1"
        title="Open modal"
        onPress={() =>
          topLevelNavigation?.dispatch(
            CommonActions.navigate({
              name: 'Modal',
              key: generateKey(),
            }),
          )
        }
      />
      <Button
        testID="stack-presentation-screen-without-header-1"
        title="Push without header"
        onPress={() =>
          topLevelNavigation?.dispatch(StackActions.push('PushWithoutHeader'))
        }
      />
      {navigation.canGoBack() && (
        <Button
          testID="stack-presentation-screen-go-back-button-1"
          title="Go back"
          onPress={() => navigation.goBack()}
        />
      )}
    </ScrollView>
  );
};

const ScreenWithoutHeader = ({navigation}: ScreenProps): React.JSX.Element => {
  const topLevelNavigation = useContext(NavigationContext);

  return (
    // <ScrollView contentContainerStyle={[styles.container, styles.noHeader]}>
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        testID="stack-presentation-screen-with-header-2"
        title="Push"
        onPress={() => topLevelNavigation?.dispatch(StackActions.push('Push'))}
      />
      <Button
        testID="stack-presentation-form-screen-push-modal-2"
        title="Open modal"
        onPress={() => topLevelNavigation?.dispatch(StackActions.push('Modal'))}
      />
      <Button
        testID="stack-presentation-screen-without-header-2"
        title="Push without header"
        onPress={() =>
          topLevelNavigation?.dispatch(StackActions.push('PushWithoutHeader'))
        }
      />
      {navigation.canGoBack() && (
        <Button
          testID="stack-presentation-screen-go-back-button-2"
          title="Go back"
          onPress={() => navigation.goBack()}
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
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const Stack = createNativeStackNavigator();

let lastState: AppStateStatus;

export const NavigationContext =
  createContext<NavigationContainerRef<any> | null>(null);

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
  const [topLevelNavigation, setTopLevelNavigation] =
    useState<NavigationContainerRef<any> | null>(null);
  return (
    <GestureHandlerRootView style={styles.flexOne}>
      <GestureDetectorProvider>
        <NavigationContext.Provider value={topLevelNavigation}>
          <NavigationContainer
            ref={setTopLevelNavigation}
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
        </NavigationContext.Provider>
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
