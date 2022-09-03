import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import Input from './components/Input';
import IconButton from './components/IconButton';
import { images } from './images';

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
// StatusBar is coloring in Android
export default function App() {
  const [newTask, setNewTask] = useState('');

  const _addTask = () => {
    alert(`Add : ${newTask}`);
    setNewTask('');
  };

  const _handleTextChange = (text) => {
    setNewTask(text);
  };

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
        />

        <IconButton type={images.uncompleted} />
      </Container>
    </ThemeProvider>
  );
}
