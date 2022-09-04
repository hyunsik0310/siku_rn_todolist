import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, StatusBar, View } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import Input from './components/Input';
import IconButton from './components/IconButton';
import { images } from './images';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

// SafeAreaView -> cover nochi design in ios
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;
const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.main};
  align-self: flex-start;
  margin: 0px 20px;
`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;
// StatusBar is coloring in Android
export default function App() {
  const width = Dimensions.get('window').width;
  const [isReady, setIsReady] = useState(false);
  const [newTask, setNewTask] = useState('');

  // async사용하기 전 소스
  // const [tasks, setTasks] = useState({
  //   1: { id: '1', text: 'Hanbit', completed: false },
  //   2: { id: '2', text: 'ReactNative1', completed: true },
  //   3: { id: '3', text: 'ReactNative + ', completed: false },
  // });

  const [tasks, setTasks] = useState({});

  // AsyncStorage기능을 이용해 데이터를 저장
  const _saveTask = async (tasks) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
      setTasks(tasks);
    } catch (e) {
      console.error(e);
    }
  };
  const _loadTask = async () => {
    const loadedTasks = await AsyncStorage.getItem('@task');
    setTasks(JSON.parse(loadedTasks || '{}'));
  };

  const _addTask = () => {
    // alert(`Add : ${newTask}`);
    // setNewTask('');

    const ID = Date.now().toString();
    const newTaskObject = {
      [ID]: { id: ID, text: newTask, completed: false },
    };
    setNewTask('');
    _saveTask({ ...tasks, ...newTaskObject });
    //setTasks({ ...tasks, ...newTaskObject });
  };

  const _deleteTask = (id) => {
    const currentTasks = Object.assign({}, tasks);
    delete currentTasks[id];
    //setTasks(currentTasks);
    _saveTask(currentTasks);
  };

  const _toggleTask = (id) => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    //setTasks(currentTasks);
    _saveTask(currentTasks);
  };

  const _updateTask = (item) => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[item.id] = item;
    //setTasks(currentTasks);
    _saveTask(currentTasks);
  };

  const _handleTextChange = (text) => {
    setNewTask(text);
  };

  const _onBlur = () => {
    setNewTask('');
  };

  useEffect(() => {
    async function prepare() {
      try {
        // preventAutoHideAsync를 이용하여 스플레시 화면을 띄워준다!!
        await SplashScreen.preventAutoHideAsync();

        // 스플래시 화면과 함께 프리로드 해야 하는 부분을 여기에서 처리한다
        const loadedTasks = await AsyncStorage.getItem('@task');
        setTasks(JSON.parse(loadedTasks || '{}'));

        await SplashScreen.hideAsync();
        // 개발중 강제로 로딩효과를 위해 2초 딜레이를 줘볼 수 있다.
        // await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // 로딩이 끝나면 앱레디를 true로 설정해준다
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      // 앱레디가 true로 변하면 스플래시 화면을 숨겨준다!
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <StatusBar
          barStyle='light-content'
          //barStyle='dark-content'
          backgroundColor={theme.background}
        ></StatusBar>
        <Title>TODO List</Title>
        <Input
          placeholder='+ Add a Task'
          value={newTask}
          onChangeText={_handleTextChange}
          onSubmitEditing={_addTask}
          onBlur={_onBlur}
        />
        <List width={width}>
          {Object.values(tasks)
            .reverse() // 최신항목이 가장 앞에 보이도록 tasks를 역순으로 렌더링
            .map((item) => (
              <Task
                key={item.id}
                item={item}
                deleteTask={_deleteTask}
                toggleTask={_toggleTask}
                updateTask={_updateTask}
              ></Task>
            ))}
        </List>
        {/* <IconButton type={images.uncompleted} />
        <IconButton type={images.completed} />
        <IconButton type={images.delete} />
        <IconButton type={images.update} /> */}
      </Container>
    </ThemeProvider>
  );
}
