import React from "react";
import styled from "styled-components/native";
import { FlatList } from "react-native";
import { useThemeContext } from "../useTheme";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
  padding: 20px;
`;

const Header = styled.Text`
  color: ${(props: any) => props.theme.colors.text};
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const TodoItem = styled.View`
  background-color: ${(props: any) => props.theme.colors.card};
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 12px;
`;

const TodoText = styled.Text`
  color: ${(props: any) => props.theme.colors.text};
  font-size: 16px;
`;

const AddButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.primary};
  padding: 16px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 30px;
  right: 30px;
  elevation: 4;
`;

const AddButtonText = styled.Text`
  color: #fff;
  font-size: 22px;
  font-weight: bold;
`;

const dummyTodos = [
  { id: "1", text: "Finish React Native setup" },
  { id: "2", text: "Design To-Do UI" },
  { id: "3", text: "Implement Add Task feature" },
];

export default function HomeScreen() {
  const { theme } = useThemeContext();

  return (
    <Container>
      <Header>My Tasks</Header>

      <FlatList
        data={dummyTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem>
            <TodoText>{item.text}</TodoText>
          </TodoItem>
        )}
      />

      <AddButton>
        <AddButtonText>＋</AddButtonText>
      </AddButton>
    </Container>
  );
}
