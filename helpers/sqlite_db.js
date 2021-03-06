import * as SQLite from "expo-sqlite";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";

const sqlite_db = SQLite.openDatabase("savedEvents.db");

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    sqlite_db.transaction((SQLiteTransaction) => {
      SQLiteTransaction.executeSql(
        "CREATE TABLE IF NOT EXISTS savedEvents (id INTEGER PRIMARY KEY NOT NULL, coordinate REAL NOT NULL, date REAL NOT NULL, description TEXT NOT NULL, imageUrl TEXT NOT NULL, isUserEvent INTEGER NOT NULL, title TEXT NOT NULL);",
        [],
        (transaction, result) => {
          resolve(result);
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> init -> (transaction, result), transaction: " + transaction,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> init -> (transaction, result), result: " + result,
          });
        },
        (transaction, error) => {
          reject(error);
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> init -> (transaction, error), transaction: " + transaction,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> init -> (transaction, error), error: " + error,
          });
          crashlytics().recordError(error);
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
    sqlite_db.transaction((SQLiteTransaction) => {
      SQLiteTransaction.executeSql(`DELETE FROM savedEvents WHERE id = ?;`, [id],
        (transaction, result) => {
          resolve(result);
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> deleteSavedEvent -> (transaction, result), transaction: " + transaction,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> deleteSavedEvent -> (transaction, result), result: " + result,
          });
        },
        (transaction, error) => {
          reject(error);
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> deleteSavedEvent -> (transaction, error), transaction: " + transaction,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> deleteSavedEvent -> (transaction, error), error: " + error,
          });
          crashlytics().recordError(error);
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
    sqlite_db.transaction((SQLiteTransaction) => {
      SQLiteTransaction.executeSql(
        `INSERT INTO savedEvents (coordinate, date, description, imageUrl, isUserEvent, title) VALUES (?, ?, ?, ?, ?, ?);`,
        [coordinate, date, description, imageUrl, isUserEvent, title],
        (transaction, result) => {
          resolve(result);
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> insertSavedEvent -> (transaction, result), transaction: " + transaction,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> insertSavedEvent -> (transaction, result), result: " + result,
          });
        },
        (transaction, error) => {
          reject(error);
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> insertSavedEvent -> (transaction, error), transaction: " + transaction,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> insertSavedEvent -> (transaction, error), error: " + error,
          });
          crashlytics().recordError(error);
        }
      );
    });
  });

  return promise;
};

export const fetchSavedEvents = () => {
  const promise = new Promise((resolve, reject) => {
    sqlite_db.transaction((SQLiteTransaction) => {
      SQLiteTransaction.executeSql(
        "SELECT * FROM savedEvents",
        [],
        (transaction, result) => {
          resolve(result);
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> fetchSavedEvents -> (transaction, result), transaction: " + transaction,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> fetchSavedEvents -> (transaction, result), result: " + result,
          });
        },
        (transaction, error) => {
          reject(error);
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> fetchSavedEvents -> (transaction, error), transaction: " + transaction,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> fetchSavedEvents -> (transaction, error), error: " + error,
          });
          crashlytics().recordError(error);
        }
      );
    });
  });

  return promise;
};
