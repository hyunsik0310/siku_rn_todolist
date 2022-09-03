import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
//import { useWindowDimensions } from 'react-native';

const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.main,
}))`
  width: ${({ width }) => width - 40}px;
  hight: 60px;
  margin: 3px 0;
  padding: 15px 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.itemBackground};
  font-size: 25px;
  color: ${({ theme }) => theme.text};
`;

const Input = ({ placeholder }) => {
  const width = Dimensions.get('window').width;

  return (
    <StyledInput
      width={width}
      placeholder={placeholder}
      maxLength={50}
      autoCapitalize='none'
      autoCorrect={false}
      returnKeyType='done'
      // ios keyboard color change function keyboardApperance
      keyboardAppearance='dark'
    />
  );
};

export default Input;
