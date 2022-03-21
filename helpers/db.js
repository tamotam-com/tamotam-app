import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("savedEvents.db");

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS savedEvents (id INTEGER PRIMARY KEY NOT NULL, coordinate REAL NOT NULL, date REAL NOT NULL, description TEXT NOT NULL, imageUrl TEXT NOT NULL, title TEXT NOT NULL);",
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const insertSavedEvent = (
  coordinate,
  date,
  description,
  imageUrl,
  title
) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO savedEvents (coordinate, date, description, imageUrl, title) VALUES (?, ?, ?, ?, ?);`,
        [coordinate, date, description, imageUrl, title],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const fetchSavedEvents = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM savedEvents",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
