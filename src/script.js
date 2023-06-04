var didFileLoad = false;

let e = {
  missingAtAtLocaleMetadataError: "ERROR: Missing @@local metadata",
};

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
  let id = input.id === "file-0" ? 0 : 1;

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
      inflateHtmlFromJson(id, JSON.parse(text));
    };
    fr.readAsText(file);
  }
}

function inflateHtmlFromJson(id, json) {
  let rows = "";

  if (!window.didFileLoad) {
    let locale = json["@@locale"];
    delete json["@@locale"];

    $(`#table > #thead .lang-${id}`).text(`${locale.toUpperCase()} Strings`);

    for (const key in json) {
      rows =
        rows +
        `<div class="entry">
            <div class="key" id="${key}">${key}</div>
            ${
              id == 0
                ? `<div data-lang="${locale}">${json[key]}</div>`
                : `<div data-lang="null"></div>`
            }
            ${
              id == 1
                ? `<div data-lang="${locale}">${json[key]}</div>`
                : `<div data-lang="null"></div>`
            }
       </div>`;
    }

    $("#table #tbody").html(rows);
  } else {
    let locale = json["@@locale"];
    delete json["@@locale"];

    $(`#table > #thead .lang-${id}`).text(`${locale.toUpperCase()} Strings`);

    for (const key in json) {
      let elem = $(
        `#${key.charAt(0) == "@" ? `\\${key}` : key} ~ td[data-lang="null"]`
      );
      elem.attr("data-lang", `${locale}`);
      elem.text(`${json[key]}`);
    }
  }

  window.didFileLoad = !window.didFileLoad;
}

function handleError(string, alertUser = false) {
  console.error(string);
  if (alertUser) {
    alert(string);
  }
}

function scrapeHtmltoJson(map) {}
