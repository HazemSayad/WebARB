var didFileLoad = false;
var lang0locale;
var lang1locale;

const E = {
  missingAtAtLocaleMetadataError: "ERROR: Missing @@local metadata",
  supplementaryKeyExistsWithoutMainKeyError:
    "ERROR: A supplementary key exists without a main key. Key: ",
  placeholderTypeUndefinedError: "Placeholder Type Undefined Error. Key: ",
  convertJsonToArbLocaleIsMissing:
    "convertJsonToArb was called without a Locale",
};

$(function () {
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert("The File APIs are not fully supported in this browser.");
    return;
  }

  $("#file-0").on("change", handleSelectedFile);
  $("#file-1").on("change", handleSelectedFile);
  makeSaveFileClickable(0);
  makeSaveFileClickable(1);
});

function convertJsonToArb(json, locale) {
  if (!locale) {
    console.error("locale: ", locale);
    handleError(E.convertJsonToArbLocaleIsMissing);
    return;
  }

  let arb = {
    "@@locale": locale,
  };

  for (const key in json) {
    if (Object.hasOwnProperty.call(json, key)) {
      const text = json[key].text;
      const extra = json[key].extra;

      arb[key] = text;
      arb[`@${key}`] = extra;
    }
  }

  return arb;
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

  id == 0 ? (lang0locale = locale) : (lang1locale = locale);

  json = prepareJSON(json);

  if (!window.didFileLoad) {
    $(`#thead .lang-${id}`).text(`${locale.toUpperCase()} Strings`);

    for (const key in json) {
      rows = rows + createEntryFromKeyJSON(id, locale, key, json);
    }

    $("#table #tbody").html(rows);
  } else {
    $(`#thead .lang-${id}`).text(`${locale.toUpperCase()} Strings`);

    for (const key in json) {
      let elem = $(`#${key} ~ div[data-lang="null"]`);
      elem.attr("data-lang", `${locale}`);
      elem.text(`${json[key].text}`);
    }
  }

  if (!window.didFileLoad) {
    makeArrowClickable();
    makeKebabClickable();
    makeSaveEntryClickable();
    makeDropdownEditButtonClickable();
    makeCloseButtonModalDialogClickable();
  }

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

function makeArrowClickable() {
  $(".arrow").on("click", function () {
    let arrowElement = $(this);
    arrowElement.toggleClass("down");
    let mainElement = arrowElement.next();
    let extraElement = mainElement.next();
    mainElement.children().toggleClass("active-long-text-wrapping");
    extraElement.toggle();
  });
}

function makeKebabClickable() {
  let kebab = $(".kebab");
  kebab.on("click", function () {
    let dropdown = $(this).children().last();
    let isClickedOnDropdownActive = dropdown.hasClass("active");
    $(".dropdown.active").removeClass("active");
    if (!isClickedOnDropdownActive) {
      dropdown.addClass("active");
    }
  });
}

function makeSaveEntryClickable() {
  let saveEntryButton = $("#save-entry");
  saveEntryButton.on("click", function () {
    let editDialog = $("#edit-dialog");
    let messageKey = editDialog.children(".dialog-key.message-key").text();
    let lang0 = editDialog.children("#lang-0").val();
    let lang1 = editDialog.children("#lang-1").val();

    updateEntryLocaleStringsByKey(messageKey, lang0, lang1);
    toggleModalDialogVisibility();
  });
}

function makeDropdownEditButtonClickable() {
  let editButton = $(".edit-button");
  editButton.on("click", function () {
    let button = $(this);
    let entry = button.parentsUntil("#tbody", ".entry");
    let [json0, json1] = extractDataFromEntryToJSON(entry);
    fillModalFieldsWithJSONEntryData(json0, json1);
    toggleModalDialogVisibility();
  });
}

function updateEntryLocaleStringsByKey(key, lang0, lang1) {
  let keyElement = $(`#${key}`);
  let lang0Element = keyElement.next();
  let lang1Element = lang0Element.next();

  lang0Element.text(lang0);
  lang1Element.text(lang1);
}

function extractDataFromEntryToJSON(entry) {
  let main = entry.children(".main");
  let extra = entry.children(".extra");

  const key = main.children(".key").text();
  const lang0 = $(main.children(".localized-text")["0"]).text();
  const lang1 = $(main.children(".localized-text")["1"]).text();

  const description = $(extra.children(".description"))
    .text()
    .replace(/^Description:\s/g, "");

  let placeholdersListItems = extra.find("li[data-key]");
  let placeholders = {};

  placeholdersListItems.each(function () {
    let li = $(this);
    let key = li.data("key");
    let type = li.children(".placeholder-type").data("placeholder-type");
    let example = $(li.children(".placeholder-example"))
      .text()
      .replace(/^example:\s/g, "");
    placeholders[key] = { type, example };
  });

  let json0 = {};
  let json1 = {};

  json0[key] = { text: lang0, extra: {} };
  description.length > 0 ? (json0[key].extra.description = description) : null;
  Object.keys(placeholders).length > 0
    ? (json0[key].extra.placeholders = placeholders)
    : null;

  json1[key] = { text: lang1, extra: {} };
  description.length > 0 ? (json1[key].extra.description = description) : null;
  Object.keys(placeholders).length > 0
    ? (json1[key].extra.placeholders = placeholders)
    : null;

  return [json0, json1];
}

function createEntryFromKeyJSON(id, locale, key, json) {
  return `<div class="entry">

            <div class="kebab">
              <figure></figure>
              <figure></figure>
              <figure></figure>
              <ul class="dropdown">
                <li><div class="edit-button">Edit</div></li>
                <li class="deactivated"><div class="delete-button">Delete</div></li>
              </ul>
            </div>

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
            ${
              json[key]?.extra
                ? `<div class="extra">
                    ${
                      json[key].extra?.description
                        ? `<div class="description">Description: ${json[key].extra.description}</div>`
                        : ``
                    }
                    ${
                      json[key].extra?.placeholders
                        ? `
                          <div class="arrow"></div>
                          <div class="placeholders-label">Placeholders</div>
                          <div class="placeholders">
                            <ul>
                              ${placeholdersToListItems(
                                json[key].extra.placeholders
                              )}
                            </ul>
                          </div>
                          `
                        : ``
                    }
                  </div>`
                : ``
            }
            
        </div>`.replace(/\>\s+\</g, "><");
}

function placeholdersToListItems(placeholders) {
  let listItems = "";
  for (const key in placeholders) {
    if (placeholders.hasOwnProperty(key)) {
      const placeholder = placeholders[key];
      listItems += `
      <li data-key="${key}">${key}
      ${
        placeholder?.type
          ? `<div
          class="placeholder-type ${placeholder.type}"
          data-placeholder-type="${placeholder.type}"
        >
          ${placeholder.type}
        </div>`
          : handleError(E.placeholderTypeUndefinedError + key, true)
      }
        
        ${
          placeholder?.example
            ? `<div class="placeholder-example"><i>example:</i> ${placeholder.example}</div>`
            : ``
        }
      </li>`;
    }
  }

  return listItems;
}

function toggleModalDialogVisibility() {
  $("#edit-key-modal-dialog").toggleClass("active-modal-dialog");
  toggleBlurAllButSelector("#edit-key-modal-dialog");
}

function makeCloseButtonModalDialogClickable() {
  $("#modal-dialog-close-button").on("click", function () {
    toggleModalDialogVisibility();
  });
}

function toggleBlurAllButSelector(selector) {
  $(`body > *:not(${selector})`).toggleClass("blurred");
}

function fillModalFieldsWithJSONEntryData(json0, json1) {
  const key = Object.keys(json0)[0];
  const lang0 = json0[key].text;
  const lang1 = json1[key].text;
  const placeholdersListItems = placeholdersToListItems(
    json0[key].extra.placeholders
  );

  let editDialog = $("#edit-dialog");
  let dialogTitleMessageKey = editDialog.children(".dialog-key.message-key");
  let textArea0 = editDialog.children("textarea#lang-0");
  let textArea1 = editDialog.children("textarea#lang-1");
  let lang0Label = editDialog.children('.dialog-lang[data-lang="lang-0"]');
  let lang1Label = editDialog.children('.dialog-lang[data-lang="lang-1"]');
  let placeholdersList = editDialog.find(
    "#dialog-placeholders-container > .placeholders > ul"
  );

  $(dialogTitleMessageKey).text(key);
  $(textArea0).val(lang0);
  $(textArea1).val(lang1);
  $(lang0Label).text(lang0locale?.toUpperCase());
  $(lang1Label).text(lang1locale?.toUpperCase());
  $(placeholdersList).html(placeholdersListItems);
}

function convertEntriesToJson() {
  let json0 = {};
  let json1 = {};

  $(".entry").each(function () {
    let [tempJson0, tempJson1] = extractDataFromEntryToJSON($(this));
    json0 = { ...json0, ...tempJson0 };
    json1 = { ...json1, ...tempJson1 };
  });

  return [json0, json1];
}

function makeSaveFileClickable(fileId) {
  if (fileId === 0) {
    $("#save-file-0").on("click", function () {
      let [json0] = convertEntriesToJson();

      if (Object.keys(json0).length === 0) {
        console.info("json0 is empty. nothing to save, returning.");
        return;
      }

      let arb = convertJsonToArb(json0, lang0locale);
      saveDataToFile(
        JSON.stringify(arb),
        `app_${lang0locale}.arb`,
        "text/plain"
      );
    });
  } else if (fileId === 1) {
    $("#save-file-1").on("click", function () {
      let [, json1] = convertEntriesToJson();

      if (Object.keys(json1).length === 0) {
        console.info("json1 is empty. nothing to save, returning.");
        return;
      }

      let arb = convertJsonToArb(json1, lang1locale);
      saveDataToFile(
        JSON.stringify(arb),
        `app_${lang1locale}.arb`,
        "text/plain"
      );
    });
  }
}

function saveDataToFile(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
