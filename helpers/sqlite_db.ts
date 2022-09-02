import * as SQLite from "expo-sqlite";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import { SQLError, SQLResultSet, SQLTransaction, WebSQLDatabase } from "expo-sqlite";

const sqlite_db: WebSQLDatabase = SQLite.openDatabase("savedEvents.db");

export const init: () => Promise<unknown> = () => {
  const promise: Promise<unknown> = new Promise((resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
    sqlite_db.transaction((SQLiteTransaction: SQLTransaction) => {
      SQLiteTransaction.executeSql(
        `CREATE TABLE IF NOT EXISTS savedEvents (id INTEGER PRIMARY KEY NOT NULL, date REAL NOT NULL, description TEXT, imageUrl TEXT, isUserEvent INTEGER NOT NULL, latitude REAL NOT NULL, longitude REAL NOT NULL, title)`,
        [],
        (transaction: SQLTransaction, result: SQLResultSet) => {
          resolve(result);
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> init -> (transaction, result), transaction: " + transaction,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> init -> (transaction, result), result: " + result,
          });
        },
        (transaction: SQLTransaction, error: SQLError | any): void | any => {
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

export const deleteSavedEvent: (id: number | string) => Promise<unknown> = (
  id: number | string
) => {
  const promise: Promise<unknown> = new Promise((resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
    sqlite_db.transaction((SQLiteTransaction: SQLTransaction) => {
      SQLiteTransaction.executeSql(`DELETE FROM savedEvents WHERE id = ?;`, [id],
        (transaction: SQLTransaction, result: SQLResultSet) => {
          resolve(result);
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> deleteSavedEvent -> (transaction, result), transaction: " + transaction,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> deleteSavedEvent -> (transaction, result), result: " + result,
          });
        },
        (transaction: SQLTransaction, error: SQLError | any): void | any => {
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

export const insertSavedEvent:
  (date: Date, description: string, imageUrl: string, isUserEvent: boolean, latitude: number, longitude: number, title: string) => Promise<unknown> = (
    date: Date,
    description: string,
    imageUrl: string,
    isUserEvent: boolean,
    latitude: number,
    longitude: number,
    title: string
  ) => {
    const promise: Promise<unknown> = new Promise((resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
      sqlite_db.transaction((SQLiteTransaction: SQLTransaction) => {
        SQLiteTransaction.executeSql(
          `INSERT INTO savedEvents (date, description, imageUrl, isUserEvent, latitude, longitude, title) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [String(date), description, imageUrl, Number(isUserEvent), latitude, longitude, title],
          (transaction: SQLTransaction, result: SQLResultSet) => {
            resolve(result);
            analytics().logEvent("custom_log", {
              description: "--- Analytics: helpers -> sqlite_db -> insertSavedEvent -> (transaction, result), transaction: " + transaction,
            });
            analytics().logEvent("custom_log", {
              description: "--- Analytics: helpers -> sqlite_db -> insertSavedEvent -> (transaction, result), result: " + result,
            });
          },
          (transaction: SQLTransaction, error: SQLError | any): void | any => {
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

export const fetchSavedEvents: () => Promise<unknown> = () => {
  const promise: Promise<unknown> = new Promise((resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
    sqlite_db.transaction((SQLiteTransaction: SQLTransaction) => {
      SQLiteTransaction.executeSql(
        "SELECT * FROM savedEvents",
        [],
        (transaction: SQLTransaction, result: SQLResultSet) => {
          resolve(result);
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> fetchSavedEvents -> (transaction, result), transaction: " + transaction,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: helpers -> sqlite_db -> fetchSavedEvents -> (transaction, result), result: " + result,
          });
        },
        (transaction: SQLTransaction, error: SQLError | any): void | any => {
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
