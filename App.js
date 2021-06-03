import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Platform } from "react-native";
import styled from "styled-components/native";
import Constants from "expo-constants";
import _ from "lodash";

const Container = styled.SafeAreaView`
	border: 1px solid #ff0000;
	padding-top: ${Constants.statusBarHeight}px;
	flex: 1;
`;

const Contents = styled.ScrollView`
	flex: 1;
	border: 1px solid red;
`;

const KeyboardAvoidingView = styled.KeyboardAvoidingView`
	flex: 1;
`;

const Input = styled.TextInput`
	border: 1px solid #e5e5e5;
	padding: 10px 24px;
	flex: 1;
`;

const ToDoItem = styled.View`
	align-items: center;
	flex-direction: row;
`;

const ToDoText = styled.Text`
	font-size: 20px;
	padding: 8px 24px;

	flex: 1;
`;

const ToDoItemButton = styled.Button``;

const InputContainer = styled.View`
	flex-direction: row;
`;

const Button = styled.Button``;

export default function App() {
	const [newTodo, setNewTodo] = useState("");
	const [list, setList] = useState([
		{
			id: "1",
			todo: "할일1",
		},
		{
			id: "2",
			todo: "할일2",
		},
	]);
	return (
		<Container>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<Contents>
					{list.map((item) => {
						return (
							<ToDoItem key={item.id}>
								<ToDoText>{item.todo}</ToDoText>
								<ToDoItemButton
									title='삭제'
									onPress={() => {
										const rejected = _.reject(
											list,
											(garbage) => item.id === garbage.id
										);
										setList(rejected);
									}}
								/>
							</ToDoItem>
						);
					})}
				</Contents>
				<InputContainer>
					<Input onChangeText={(text) => setNewTodo(text)} value={newTodo} />
					<Button
						title='전송'
						onPress={() => {
							if (newTodo.replace(/(\s*)/g, "") === "") {
								setNewTodo("");
								return;
							}
							setList(() => [...list, { id: list.length + 1, todo: newTodo }]);

							setNewTodo("");
						}}
					></Button>
				</InputContainer>
			</KeyboardAvoidingView>
		</Container>
	);
}
