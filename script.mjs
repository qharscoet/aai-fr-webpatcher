import { diff, patch } from './bsdiff-wasm/browser/wrapper.mjs'


const patch_list = {
  "from_jp" : "Choky_patch.ndspatch",
  "from_en" : "Anthiflo_patch.ndspatch"
};

const dest_filename = "Ace Attorney Investigations 2 Prosecutor's Path VF.nds";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function assert(condition, message) {
  if (!condition || condition instanceof Error) {
    alert(message);
    throw new Error(message);
  }
}


const bspatchButton = document.querySelector('#bspatch');
bspatchButton.addEventListener('click', async () => {
  const oldFile = document.querySelector('#oldFile2').files[0];
  assert(oldFile, 'Pas de rom sélectionnée');
  
  const selected_version = document.querySelector('#aai2-version').value;
  const patchFileName = patch_list[selected_version];
  assert(patchFileName, 'Sélectionnez une version');
  
  if(patchFileName){
    
    const patchFile = await fetch('./patches/' + patchFileName);
    
    const oldFileData = new Uint8Array(await oldFile.arrayBuffer());
    const patchFileData = new Uint8Array(await patchFile.arrayBuffer());
    
    console.log('Running bspatch', oldFile, patchFile);
    
    bspatchButton.disabled = true;
    const newFileData = await patch(oldFileData, patchFileData).catch(err => err);
    bspatchButton.disabled = false;
    assert(newFileData, newFileData.message || 'Failed to create new file');
    
    console.log('bspatch done', newFileData);
    
    const blob = new Blob([newFileData], { type: oldFile.type });
    downloadBlob(blob, dest_filename);
  }
  
});
