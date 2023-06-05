var didFileLoad = false;

const E = {
  missingAtAtLocaleMetadataError: "ERROR: Missing @@local metadata",
  supplementaryKeyExistsWithoutMainKeyError:
    "ERROR: A supplementary key exists without a main key. Key: ",
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

  if (!json.hasOwnProperty("@@locale")) {
    handleError(E.missingAtAtLocaleMetadataError, true);
    return;
  }

  const locale = json["@@locale"];
  delete json["@@locale"];

  json = prepareJSON(json);

  if (!window.didFileLoad) {
    $(`#table > #thead .lang-${id}`).text(`${locale.toUpperCase()} Strings`);

    for (const key in json) {
      rows =
        rows +
        `<div class="entry">
            <div class="arrow"></div>
            <div class="main">
              <div class="key" id="${key}">${key}</div>
              ${
                id == 0
                  ? `<div class="localized-text" data-lang="${locale}">${json[key].text}</div>`
                  : `<div class="localized-text" data-lang="null"></div>`
              }
              ${
                id == 1
                  ? `<div class="localized-text" data-lang="${locale}">${json[key].text}</div>`
                  : `<div class="localized-text" data-lang="null"></div>`
              }
            </div>
            <div class="extra">
              <div class="description">Description: ${
                json[key]?.extra?.description
              }</div>
            </div>
        </div>`;
    }

    $("#table #tbody").html(rows);
  } else {
    $(`#table > #thead .lang-${id}`).text(`${locale.toUpperCase()} Strings`);

    for (const key in json) {
      let elem = $(
        `#${key.charAt(0) == "@" ? `\\${key}` : key} ~ td[data-lang="null"]`
      );
      elem.attr("data-lang", `${locale}`);
      elem.text(`${json[key].text}`);
    }
  }

  makeElementClickable();

  window.didFileLoad = !window.didFileLoad;
}

function handleError(string, alertUser = false) {
  console.error(string);
  if (alertUser) {
    alert(string);
  }
}

function prepareJSON(json) {
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      if (key.charAt(0) == "@") {
        //check if the main key exists then inject it into extra then delete the key with @
        let mainKey = key.substring(1);

        if (!json.hasOwnProperty(mainKey)) {
          handleError(E.supplementaryKeyExistsWithoutMainKeyError + key, true);
          return;
        }

        json[mainKey] = { text: json[mainKey], extra: { ...json[key] } };
        delete json[key];
      }
    }
  }

  return json;
}

function makeElementClickable() {
  $(".arrow").on("click", function () {
    // Call your custom function here
    $(this).toggleClass("down");
  });
}

function scrapeHtmltoJson(map) {}
