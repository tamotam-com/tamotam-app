import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("savedEvents.db");

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS savedEvents (id INTEGER PRIMARY KEY NOT NULL, coordinate REAL NOT NULL, date REAL NOT NULL, description TEXT NOT NULL, imageUrl TEXT NOT NULL, isUserEvent INTEGER NOT NULL, title TEXT NOT NULL);",
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

export const deleteSavedEvent = (
  id
) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`DELETE FROM savedEvents WHERE id = ?;`, [id], (_, result) => {
        console.log("ok saved");
        console.log(result);
        resolve(result);
      },
        (_, err) => {
          console.log(err);
          reject(err);
        })
    })
  });

  return promise;
};

export const insertSavedEvent = (
  coordinate,
  date,
  description,
  imageUrl,
  isUserEvent,
  title
) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO savedEvents (coordinate, date, description, imageUrl, isUserEvent, title) VALUES (?, ?, ?, ?, ?, ?);`,
        [coordinate, date, description, imageUrl, isUserEvent, title],
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
          console.log(result);
          resolve(result);
        },
        (_, err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });

  return promise;
};
