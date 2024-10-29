import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Realm from 'realm';
import {useRealm, useQuery, RealmProvider} from '@realm/react';

function Banner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>ToDo example with React Native</Text>
    </View>
  );
}

class Item extends Realm.Object {
  static schema = {
    name: 'TodoItem',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      text: 'string',
    },
  };
}

function ToDoList() {
  const [itemText, setItemText] = useState('');
  const realm = useRealm();
  const dbItems = useQuery(Item);

  const addToDoItem = () => {
    if (itemText !== '') {
      const id = Math.floor(Math.random() * (10000 - 1) + 1);
      console.log(id);
      realm.write(() => {
        realm.create('TodoItem', {
          _id: id,
          text: itemText,
        });
      });
      // modify newItem text to ""
      setItemText('');
    }
    Keyboard.dismiss();
  };

  const removeItem = id => {
    // filter/remove item with id
    realm.write(() => {
      realm.delete(realm.objectForPrimaryKey('TodoItem', id));
    });
  };

  return (
    <View>
      <View style={styles.addToDo}>
        <TextInput
          style={styles.addToDoTextInput}
          value={itemText}
          onChangeText={text => setItemText(text)}
          placeholder="Write a new todo here"
        />
        <Button
          title="Add"
          style={styles.addTodoButton}
          onPress={addToDoItem}
        />
      </View>
      <ScrollView style={styles.list}>
        {dbItems.length !== 0 &&
          dbItems.map((item, index) => (
            <View key={item._id} style={styles.listItem}>
              <Text style={styles.listItemText}>* {item.text}</Text>
              <Text
                style={styles.listItemDelete}
                onPress={() => removeItem(item._id)}>
                X
              </Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <RealmProvider schema={[Item]} deleteRealmIfMigrationNeeded={true}>
      <View style={styles.container}>
        <Banner />
        <ToDoList />
        <StatusBar style="auto" />
      </View>
    </RealmProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    margin: 5,
  },
  banner: {
    backgroundColor: 'cadetblue',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bannerText: {
    color: 'white',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  addToDo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addToDoTextInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    padding: 5,
    margin: 2,
    flex: 1,
  },
  list: {
    color: 'black',
    margin: 2,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
  },
  listItemText: {},
  listItemDelete: {
    marginStart: 10,
    color: 'red',
    fontWeight: 'bold',
  },
});
