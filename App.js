import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Platform, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import produce from "immer";

import _ from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Container = styled.SafeAreaView`
	padding-top: ${Constants.statusBarHeight}px;
	flex: 1;
`;

const Contents = styled.ScrollView`
	flex: 1;
	padding: 8px 24px;
`;

const KeyboardAvoidingView = styled.KeyboardAvoidingView`
	flex: 1;
`;

const Input = styled.TextInput`
	border: 1px solid #e5e5e5;
	padding: 10px 24px;
	margin-bottom: 3px;

	flex: 1;
`;

const ToDoItem = styled.View`
	align-items: center;
	flex-direction: row;
`;

const ToDoText = styled.Text`
	font-size: 20px;

	flex: 1;
`;

const Check = styled.TouchableOpacity`
	margin-right: 4px;
`;
const CheckIcon = styled.Text`
	font-size: 20px;
`;

const InputContainer = styled.View`
	flex-direction: row;
	padding-left: 10px;
`;

const ToDoItemButton = styled.Button``;
const Button = styled.Button``;

export default function App() {
	const [newTodo, setNewTodo] = useState("");
	const [list, setList] = useState([]);

	useEffect(() => {
		AsyncStorage.getItem("LIST")
			.then((data) => {
				if (data !== null) {
					setList(JSON.parse(data));
				}
			})
			.catch((err) => alert(err));
	}, []);

	const store = (newList) => {
		setList(newList);
		AsyncStorage.setItem("LIST", JSON.stringify(newList));
	};

	const handlePress = (id) => {
		setList(
			produce(list, (draft) => {
				draft[id - 1].done = true;
			})
		);
		store(newList);
	};

	return (
		<Container>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<Contents>
					{list.map((item) => {
						return (
							<ToDoItem key={item.id}>
								<Check
									onPress={() => {
										store(
											produce(list, (draft) => {
												draft[item.id - 1].done = !list[item.id - 1].done;
											})
										);
									}}
								>
									<CheckIcon>{item.done ? "✅" : "☑️"}</CheckIcon>
								</Check>

								<ToDoText>{item.todo}</ToDoText>

								<ToDoItemButton
									title='삭제'
									onPress={() => {
										const rejected = _.reject(
											list,
											(garbage) => item.id === garbage.id
										);
										store(rejected);
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
							let newItem = {
								id: list.length + 1,
								todo: newTodo,
								done: false,
							};
							store([...list, newItem]);
							setNewTodo("");
						}}
					></Button>
				</InputContainer>
			</KeyboardAvoidingView>
		</Container>
	);
}
