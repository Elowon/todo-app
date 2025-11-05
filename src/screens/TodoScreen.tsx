
import bgLight from "../../assets/bg-light.jpg";
import bgDark from "../../assets/bg-dark.jpg";

import React, { useState, useEffect } from "react";
import { FlatList, ImageBackground, SafeAreaView } from "react-native";
import styled from "styled-components/native";
import { useThemeContext } from "../useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";


const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(p: any) => p.theme.colors.background};
`;

const HeaderBackground = styled(ImageBackground)`
  height: 260px;
  justify-content: flex-end;
  padding: 24px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: -20px;
  margin-bottom: 80px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 800;
  color: white;
  letter-spacing: 8px;
`;

const ThemeToggle = styled.TouchableOpacity`
  padding: 8px;
`;

const TodoWrapper = styled.View`
  flex: 1;
  margin-top: -40px;
  align-items: center;
`;

const TodoBox = styled.View`
  width: 90%;
  min-height: 520px;
  background-color: ${(p: any) => p.theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  padding-top: 32px;
  shadow-color: #000;
  shadow-opacity: 0.12;
  shadow-radius: 10px;
  elevation: 5;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(p: any) => p.theme.colors.surface};
  border-radius: 8px;
  padding: 0 12px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: #e0e0e0;
  elevation: 2;
`;

const Input = styled.TextInput`
  flex: 1;
  padding: 12px;
  font-size: 16px;
  color: ${(p: any) => p.theme.colors.text};
`;

const AddButton = styled.TouchableOpacity`
  background-color: ${(p: any) => p.theme.colors.primary};
  padding: 10px 14px;
  border-radius: 8px;
  margin-left: 8px;
`;

const AddButtonText = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 18px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${(p: any) => p.theme.colors.surface};
  padding: 12px 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: ${(p: any) => p.theme.colors.border || "#ddd"};
`;

const LeftRow = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const HandleTouchable = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 12px;
`;

const ToggleTouchable = styled.TouchableOpacity`
  flex: 1;
  padding-right: 12px;
`;

const TaskText = styled.Text<{ completed: boolean }>`
  font-size: 16px;
  color: ${(p: any) => p.theme.colors.text};
  text-decoration-line: ${(p) => (p.completed ? "line-through" : "none")};
  opacity: ${(p) => (p.completed ? 0.6 : 1)};
`;

const DeleteTouchable = styled.TouchableOpacity`
  padding: 6px 8px;
  border-radius: 6px;
`;

const DeleteText = styled.Text`
  color: crimson;
  font-weight: 700;
`;

const FilterRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 8px;
  border-top-width: 1px;
  border-color: #e0e0e0;
  margin-top: 16px;
`;

const FilterGroup = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${(p: any) => p.theme.colors.surface};
`;

const TouchableFilter = styled.TouchableOpacity`
  padding: 4px 6px;
  border-radius: 6px;
`;

const FilterText = styled.Text<{ active?: boolean }>`
  color: ${(p) => (p.active ? p.theme.colors.primary : "#666")};
  font-weight: ${(p) => (p.active ? "700" : "500")};
  font-size: 14px;
`;


type Item = { id: string; text: string; completed: boolean };
const STORAGE_KEY = "TODOS_V1";

export default function TodoScreen() {
  const { themeName, toggleTheme } = useThemeContext();
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Item[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setTodos(JSON.parse(raw));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!text.trim()) return;
    setTodos((prev) => [
      { id: Date.now().toString(), text: text.trim(), completed: false },
      ...prev,
    ]);
    setText("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const clearCompleted = () =>
    setTodos((prev) => prev.filter((t) => !t.completed));

  const EmptyComponent = () => (
    <Title style={{ fontSize: 18, color: "#888", letterSpacing: 0 }}>
      No tasks yet
    </Title>
  );

  const itemsLeft = todos.filter((t) => !t.completed).length;

  return (
    <Screen>
      <HeaderBackground
        source={themeName === "light" ? bgLight : bgDark}
        resizeMode="cover"
      >
        <HeaderRow>
          <Title>TODO</Title>
          <ThemeToggle onPress={toggleTheme}>
            {themeName === "light" ? (
              <Feather name="moon" size={28} color="white" />
            ) : (
              <Feather name="sun" size={28} color="white" />
            )}
          </ThemeToggle>
        </HeaderRow>
      </HeaderBackground>

      <TodoWrapper>
        <TodoBox>
          <InputContainer>
            <Input
              placeholder="Create a new task..."
              placeholderTextColor="#888"
              value={text}
              onChangeText={setText}
              returnKeyType="done"
              onSubmitEditing={addTodo}
            />
            <AddButton onPress={addTodo} accessibilityLabel="Add task">
              <AddButtonText>+</AddButtonText>
            </AddButton>
          </InputContainer>

          
          {filter === "all" ? (
            <DraggableFlatList
              data={todos}
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => setTodos(data)}
              renderItem={({
                item,
                drag,
              }: RenderItemParams<Item>) => (
                <Row
                 
                  style={{ opacity: item.completed ? 0.8 : 1 }}
                >
                  <LeftRow>
                    <HandleTouchable
                      accessibilityLabel="Drag handle"
                      onLongPress={drag}
                      delayLongPress={120}
                    >
                      <MaterialIcons
                        name="drag-handle"
                        size={26}
                        color={item.completed ? "#999" : "#666"}
                        style={{ opacity: 0.9 }}
                      />
                    </HandleTouchable>

                    <ToggleTouchable onPress={() => toggleTodo(item.id)}>
                      <TaskText completed={item.completed}>
                        {item.text}
                      </TaskText>
                    </ToggleTouchable>
                  </LeftRow>

                  <DeleteTouchable onPress={() => deleteTodo(item.id)}>
                    <DeleteText>🗑</DeleteText>
                  </DeleteTouchable>
                </Row>
              )}
              ListEmptyComponent={EmptyComponent}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <FlatList
              data={filteredTodos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Row>
                  <LeftRow>
                   
                    <HandleTouchable disabled>
                      <MaterialIcons
                        name="drag-handle"
                        size={22}
                        color={item.completed ? "#999" : "#666"}
                        style={{ opacity: 0.9 }}
                      />
                    </HandleTouchable>

                    <ToggleTouchable onPress={() => toggleTodo(item.id)}>
                      <TaskText completed={item.completed}>
                        {item.text}
                      </TaskText>
                    </ToggleTouchable>
                  </LeftRow>

                  <DeleteTouchable onPress={() => deleteTodo(item.id)}>
                    <DeleteText>🗑</DeleteText>
                  </DeleteTouchable>
                </Row>
              )}
              ListEmptyComponent={EmptyComponent}
              keyboardShouldPersistTaps="handled"
            />
          )}

          
          <FilterRow>
            <FilterText>{itemsLeft} items left</FilterText>
            <FilterText onPress={clearCompleted}>Clear Completed</FilterText>
          </FilterRow>
        </TodoBox>

        
        <FilterGroup
          style={{
            borderWidth: 1.5,
            borderColor: themeName === "light" ? "#3A7CFD" : "#8AA9FF",
            borderRadius: 6,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginTop: 18,
          }}
        >
          {["all", "active", "completed"].map((f) => (
            <TouchableFilter
              key={f}
              onPress={() => setFilter(f as any)}
              style={{ marginHorizontal: 8 }}
            >
              <FilterText active={filter === f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </FilterText>
            </TouchableFilter>
          ))}
        </FilterGroup>

        <FilterText
          style={{
            color: themeName === "light" ? "#777" : "#aaa",
            textAlign: "center",
            marginTop: 16,
            fontSize: 15,
          }}
        >
          Drag and drop to reorder list
        </FilterText>
      </TodoWrapper>
    </Screen>
  );
}
