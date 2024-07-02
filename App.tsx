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

interface MainScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const MainScreen = ({navigation}: MainScreenProps): React.JSX.Element => {
  const topLevelNavigation = useContext(NavigationContext);
  return (
    <ScrollView
      // style={{ ...styles.container, backgroundColor: 'thistle' }}
      testID="stack-presentation-root-scroll-view">
      <Button
        title="push"
        onPress={() =>
          topLevelNavigation?.dispatch(StackActions.push('MainPush'))
        }
        testID="stack-presentation-push-button"
      />
    </ScrollView>
  );
};

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
    <View style={{...styles.container}}>
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
      <Button
        testID="stack-presentation-screen-go-back-button-1"
        title="Go back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const ScreenWithoutHeader = ({navigation}: ScreenProps): React.JSX.Element => {
  const topLevelNavigation = useContext(NavigationContext);

  return (
    <View style={{...styles.container}}>
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
      <Button
        testID="stack-presentation-screen-go-back-button-2"
        title="Go back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

interface ModalScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const ModalScreen = ({navigation}: ModalScreenProps): React.JSX.Element => {
  return (
    <View style={[styles.container]}>
      <Button
        testID="stack-presentation-modal-screen-go-back-button"
        title="Go back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const Stack = createNativeStackNavigator();
const PushStackNavigator = createNativeStackNavigator();

const PushStack = () => {
  return (
    <PushStackNavigator.Navigator screenOptions={{presentation: 'modal'}}>
      <PushStackNavigator.Screen
        name="Push"
        component={ScreenWithHeader}
        options={{
          presentation: 'card',
          title: 'header',
        }}
      />
      <PushStackNavigator.Screen
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
    </PushStackNavigator.Navigator>
  );
};

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
                key={'Main'}
                name="Main"
                component={MainScreen}
                options={{title: `Stack Presentation ${counter}`}}
              />
              <Stack.Screen
                key={'MainPush'}
                name="MainPush"
                component={PushStack}
                options={{presentation: 'card', headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NavigationContext.Provider>
      </GestureDetectorProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: 'black',
    margin: 10,
    marginTop: 15,
  },
  switch: {
    marginTop: 15,
  },
  container: {
    flex: 1,
    paddingTop: 10,
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
