const storage = window.localStorage;
const MANUAL_SAVES_KEY = 'manual_saves'


/**
 * Load manual saves (i.e., from user) from the local storage.
 * If the saves do not exist yet, it returns an empty dictionary.
 * @return A dictionary mapping the save names to saves (`{ nodes, edges }`).
 */
function getAllManualSaves() {
  let saves = storage.getItem(MANUAL_SAVES_KEY);
  if (!saves) {
    saves = {};
  } else {
    saves = JSON.parse(saves);
  }
  return saves
}


/**
 * Set the saves in the local storage.
 * @param saves The map of save names to saves.
 */
function setManualSaves(saves) {
  const savesSerialized = JSON.stringify(saves);
  storage.setItem(MANUAL_SAVES_KEY, savesSerialized);
}


/**
 * Create or update a "manual" save (i.e., from user, not automatic).
 * @param saveName The desired name. If it already exists, it will overwrite.
 * @param save The save (`{ nodes, edges }`).
 */
function addManualSave(saveName, save) {
  const saves = getAllManualSaves();
  saves[saveName] = save;
  setManualSaves(saves);
}


/**
 * Delete an existing "manual" save (i.e., from user, not automatic).
 * @param saveName The name of the save to delete.
 */
function deleteManualSave(saveName) {
  const saves = getAllManualSaves();
  delete saves[saveName];
  setManualSaves(saves);
}


export {
  getAllManualSaves,
  addManualSave,
  deleteManualSave,
};
