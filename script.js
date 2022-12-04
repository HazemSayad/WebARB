$(function () {
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert("The File APIs are not fully supported in this browser.");
    return;
  }

  $("#file-0").on("change", handleSelectedFile);
  $("#file-1").on("change", handleSelectedFile);
});

async function convertArbToJson(map) {
  for (let k in map.keys) {
    if (!k[0].contains("@")) {
      newKey = k;
      for (var l in _replacementList) {
        newKey = newKey.replaceAll(l[1], l[0]);
      }
      newKey = newKey.replaceAll("numSb", "");

      //TODO: implement backward convert if needed
      arbMap[newKey] = _changePlaceHoldersNames(resMap[k]);
    }

    for (const key in map) {
    }
  }
}

async function convertJsonToArb(map) {
  {
    for (let k in resMap.keys) {
      newKey = k;
      for (var l in _replacementList) {
        newKey = newKey.replaceAll(l[0], l[1]);
      }
      firstLetterInt = int.tryParse(k[0]);
      if (firstLetterInt != null) {
        newKey = newKey.replaceFirst(k[0], "numSb${k[0]}");
      }
      ///
      /// Inside lang strings occurs values like {name-one}
      /// We have to change their names to the {nameOne} according
      /// the Dart notations.
      ///

      arbMap[newKey] = _changePlaceHoldersNames(resMap[k]);
    }
  }
}

function handleSelectedFile() {
  let input = this;
  console.log(input);

  if (!input.files) {
    alert(
      "This browser doesn't seem to support the `files` property of file inputs."
    );
  } else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  } else {
    let file = input.files[0];
    let fr = new FileReader();
    let text;
    fr.onload = () => {
      text = fr.result;
      inflateHtmlFromJson(JSON.parse(text));
    };
    fr.readAsText(file);
  }
}

function inflateHtmlFromJson(map) {
  let rows = "";
  console.log(map);
  for (const key in map) {
    rows =
      rows +
      `<tr class="entry">
        <td class="key" id="${key}">${key}</td>
        <td data-lang="${map["@@locale"]}">${map[key]}</td>
       </tr>`;
  }
  $("#table tr:last-child").after(rows);
}

function scrapeHtmltoJson(map) {}
