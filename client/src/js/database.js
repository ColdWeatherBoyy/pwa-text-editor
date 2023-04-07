import { openDB } from "idb";

const initdb = async () =>
	openDB("jate", 1, {
		upgrade(db) {
			if (db.objectStoreNames.contains("jate")) {
				console.log("jate database already exists");
				return;
			}
			db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
			console.log("jate database created");
		},
	});

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
	console.log("Post to the database");
	// Open a database called "jate" with version number 1
	const jateDb = await openDB("jate", 1);
	// Start a new transaction with the object store called "jate"
	const tx = jateDb.transaction("jate", "readwrite");
	// Get the object store named "jate" from the transaction
	const store = tx.objectStore("jate");
	// Put the content object into the object store with an ID of 1
	const request = store.put({ id: 1, value: content });
	// try block to make sure request is successful
	try {
		const result = await request;
		console.log("🚀 - data saved to the database", result);
	} catch (err) {
		console.error("putDb not implemented", err);
		throw new Error("Failed to save content to the database");
	}
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
	console.log("GET all from the database");
	// Open a database called "jate" with version number 1
	const jateDb = await openDB("jate", 1);
	// Start a new transaction with the object store called "jate"
	const tx = jateDb.transaction("jate", "readonly");
	// Get the object store named "jate" from the transaction
	const store = tx.objectStore("jate");
	// Get the content object from the object store with an ID of 1
	const request = store.get(1);
	// try block to make sure request is successful
	try {
		const result = await request;
		console.log("result", result);
		return result?.value;
	} catch (err) {
		console.error("getDb not implemented", err);
		throw new Error("Failed to get content from the database");
	}
};

// call of initdb function
initdb();
