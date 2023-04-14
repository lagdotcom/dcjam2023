"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // cdn:gameanalytics
  var require_gameanalytics = __commonJS({
    "cdn:gameanalytics"(exports, module) {
      module.exports = globalThis.gameanalytics;
    }
  });

  // node_modules/inkjs/engine/Path.js
  var require_Path = __commonJS({
    "node_modules/inkjs/engine/Path.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Path = void 0;
      var Path = class {
        constructor() {
          this._components = [];
          this._componentsString = null;
          this._isRelative = false;
          if (typeof arguments[0] == "string") {
            let componentsString = arguments[0];
            this.componentsString = componentsString;
          } else if (arguments[0] instanceof Path.Component && arguments[1] instanceof Path) {
            let head = arguments[0];
            let tail = arguments[1];
            this._components.push(head);
            this._components = this._components.concat(tail._components);
          } else if (arguments[0] instanceof Array) {
            let head = arguments[0];
            let relative = !!arguments[1];
            this._components = this._components.concat(head);
            this._isRelative = relative;
          }
        }
        get isRelative() {
          return this._isRelative;
        }
        get componentCount() {
          return this._components.length;
        }
        get head() {
          if (this._components.length > 0) {
            return this._components[0];
          } else {
            return null;
          }
        }
        get tail() {
          if (this._components.length >= 2) {
            let tailComps = this._components.slice(1, this._components.length);
            return new Path(tailComps);
          } else {
            return Path.self;
          }
        }
        get length() {
          return this._components.length;
        }
        get lastComponent() {
          let lastComponentIdx = this._components.length - 1;
          if (lastComponentIdx >= 0) {
            return this._components[lastComponentIdx];
          } else {
            return null;
          }
        }
        get containsNamedComponent() {
          for (let i = 0, l = this._components.length; i < l; i++) {
            if (!this._components[i].isIndex) {
              return true;
            }
          }
          return false;
        }
        static get self() {
          let path = new Path();
          path._isRelative = true;
          return path;
        }
        GetComponent(index) {
          return this._components[index];
        }
        PathByAppendingPath(pathToAppend) {
          let p = new Path();
          let upwardMoves = 0;
          for (let i = 0; i < pathToAppend._components.length; ++i) {
            if (pathToAppend._components[i].isParent) {
              upwardMoves++;
            } else {
              break;
            }
          }
          for (let i = 0; i < this._components.length - upwardMoves; ++i) {
            p._components.push(this._components[i]);
          }
          for (let i = upwardMoves; i < pathToAppend._components.length; ++i) {
            p._components.push(pathToAppend._components[i]);
          }
          return p;
        }
        get componentsString() {
          if (this._componentsString == null) {
            this._componentsString = this._components.join(".");
            if (this.isRelative)
              this._componentsString = "." + this._componentsString;
          }
          return this._componentsString;
        }
        set componentsString(value) {
          this._components.length = 0;
          this._componentsString = value;
          if (this._componentsString == null || this._componentsString == "")
            return;
          if (this._componentsString[0] == ".") {
            this._isRelative = true;
            this._componentsString = this._componentsString.substring(1);
          }
          let componentStrings = this._componentsString.split(".");
          for (let str of componentStrings) {
            if (/^(\-|\+)?([0-9]+|Infinity)$/.test(str)) {
              this._components.push(new Path.Component(parseInt(str)));
            } else {
              this._components.push(new Path.Component(str));
            }
          }
        }
        toString() {
          return this.componentsString;
        }
        Equals(otherPath) {
          if (otherPath == null)
            return false;
          if (otherPath._components.length != this._components.length)
            return false;
          if (otherPath.isRelative != this.isRelative)
            return false;
          for (let i = 0, l = otherPath._components.length; i < l; i++) {
            if (!otherPath._components[i].Equals(this._components[i]))
              return false;
          }
          return true;
        }
        PathByAppendingComponent(c) {
          let p = new Path();
          p._components.push(...this._components);
          p._components.push(c);
          return p;
        }
      };
      exports.Path = Path;
      Path.parentId = "^";
      (function(Path2) {
        class Component {
          constructor(indexOrName) {
            this.index = -1;
            this.name = null;
            if (typeof indexOrName == "string") {
              this.name = indexOrName;
            } else {
              this.index = indexOrName;
            }
          }
          get isIndex() {
            return this.index >= 0;
          }
          get isParent() {
            return this.name == Path2.parentId;
          }
          static ToParent() {
            return new Component(Path2.parentId);
          }
          toString() {
            if (this.isIndex) {
              return this.index.toString();
            } else {
              return this.name;
            }
          }
          Equals(otherComp) {
            if (otherComp != null && otherComp.isIndex == this.isIndex) {
              if (this.isIndex) {
                return this.index == otherComp.index;
              } else {
                return this.name == otherComp.name;
              }
            }
            return false;
          }
        }
        Path2.Component = Component;
      })(Path = exports.Path || (exports.Path = {}));
    }
  });

  // node_modules/inkjs/engine/Debug.js
  var require_Debug = __commonJS({
    "node_modules/inkjs/engine/Debug.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Debug = void 0;
      var Debug;
      (function(Debug2) {
        function AssertType(variable, type, message) {
          Assert(variable instanceof type, message);
        }
        Debug2.AssertType = AssertType;
        function Assert(condition, message) {
          if (!condition) {
            if (typeof message !== "undefined") {
              console.warn(message);
            }
            if (console.trace) {
              console.trace();
            }
            throw new Error("");
          }
        }
        Debug2.Assert = Assert;
      })(Debug = exports.Debug || (exports.Debug = {}));
    }
  });

  // node_modules/inkjs/engine/TypeAssertion.js
  var require_TypeAssertion = __commonJS({
    "node_modules/inkjs/engine/TypeAssertion.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.filterUndef = exports.isEquatable = exports.nullIfUndefined = exports.asINamedContentOrNull = exports.asBooleanOrThrows = exports.asNumberOrThrows = exports.asOrThrows = exports.asOrNull = void 0;
      function asOrNull(obj, type) {
        if (obj instanceof type) {
          return unsafeTypeAssertion(obj, type);
        } else {
          return null;
        }
      }
      exports.asOrNull = asOrNull;
      function asOrThrows(obj, type) {
        if (obj instanceof type) {
          return unsafeTypeAssertion(obj, type);
        } else {
          throw new Error(`${obj} is not of type ${type}`);
        }
      }
      exports.asOrThrows = asOrThrows;
      function asNumberOrThrows(obj) {
        if (typeof obj === "number") {
          return obj;
        } else {
          throw new Error(`${obj} is not a number`);
        }
      }
      exports.asNumberOrThrows = asNumberOrThrows;
      function asBooleanOrThrows(obj) {
        if (typeof obj === "boolean") {
          return obj;
        } else {
          throw new Error(`${obj} is not a boolean`);
        }
      }
      exports.asBooleanOrThrows = asBooleanOrThrows;
      function asINamedContentOrNull(obj) {
        if (obj.hasValidName && obj.name) {
          return obj;
        }
        return null;
      }
      exports.asINamedContentOrNull = asINamedContentOrNull;
      function nullIfUndefined(obj) {
        if (typeof obj === "undefined") {
          return null;
        }
        return obj;
      }
      exports.nullIfUndefined = nullIfUndefined;
      function isEquatable(type) {
        return typeof type === "object" && typeof type.Equals === "function";
      }
      exports.isEquatable = isEquatable;
      function unsafeTypeAssertion(obj, type) {
        return obj;
      }
      function filterUndef(element) {
        return element != void 0;
      }
      exports.filterUndef = filterUndef;
    }
  });

  // node_modules/inkjs/engine/NullException.js
  var require_NullException = __commonJS({
    "node_modules/inkjs/engine/NullException.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.throwNullException = exports.NullException = void 0;
      var NullException = class extends Error {
      };
      exports.NullException = NullException;
      function throwNullException(name) {
        throw new NullException(`${name} is null or undefined`);
      }
      exports.throwNullException = throwNullException;
    }
  });

  // node_modules/inkjs/engine/Object.js
  var require_Object = __commonJS({
    "node_modules/inkjs/engine/Object.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.InkObject = void 0;
      var Path_1 = require_Path();
      var Container_1 = require_Container();
      var Debug_1 = require_Debug();
      var TypeAssertion_1 = require_TypeAssertion();
      var NullException_1 = require_NullException();
      var InkObject = class {
        constructor() {
          this.parent = null;
          this._debugMetadata = null;
          this._path = null;
        }
        get debugMetadata() {
          if (this._debugMetadata === null) {
            if (this.parent) {
              return this.parent.debugMetadata;
            }
          }
          return this._debugMetadata;
        }
        set debugMetadata(value) {
          this._debugMetadata = value;
        }
        get ownDebugMetadata() {
          return this._debugMetadata;
        }
        DebugLineNumberOfPath(path) {
          if (path === null)
            return null;
          let root = this.rootContentContainer;
          if (root) {
            let targetContent = root.ContentAtPath(path).obj;
            if (targetContent) {
              let dm = targetContent.debugMetadata;
              if (dm !== null) {
                return dm.startLineNumber;
              }
            }
          }
          return null;
        }
        get path() {
          if (this._path == null) {
            if (this.parent == null) {
              this._path = new Path_1.Path();
            } else {
              let comps = [];
              let child = this;
              let container = TypeAssertion_1.asOrNull(child.parent, Container_1.Container);
              while (container !== null) {
                let namedChild = TypeAssertion_1.asINamedContentOrNull(child);
                if (namedChild != null && namedChild.hasValidName) {
                  if (namedChild.name === null)
                    return NullException_1.throwNullException("namedChild.name");
                  comps.unshift(new Path_1.Path.Component(namedChild.name));
                } else {
                  comps.unshift(new Path_1.Path.Component(container.content.indexOf(child)));
                }
                child = container;
                container = TypeAssertion_1.asOrNull(container.parent, Container_1.Container);
              }
              this._path = new Path_1.Path(comps);
            }
          }
          return this._path;
        }
        ResolvePath(path) {
          if (path === null)
            return NullException_1.throwNullException("path");
          if (path.isRelative) {
            let nearestContainer = TypeAssertion_1.asOrNull(this, Container_1.Container);
            if (nearestContainer === null) {
              Debug_1.Debug.Assert(this.parent !== null, "Can't resolve relative path because we don't have a parent");
              nearestContainer = TypeAssertion_1.asOrNull(this.parent, Container_1.Container);
              Debug_1.Debug.Assert(nearestContainer !== null, "Expected parent to be a container");
              Debug_1.Debug.Assert(path.GetComponent(0).isParent);
              path = path.tail;
            }
            if (nearestContainer === null) {
              return NullException_1.throwNullException("nearestContainer");
            }
            return nearestContainer.ContentAtPath(path);
          } else {
            let contentContainer = this.rootContentContainer;
            if (contentContainer === null) {
              return NullException_1.throwNullException("contentContainer");
            }
            return contentContainer.ContentAtPath(path);
          }
        }
        ConvertPathToRelative(globalPath) {
          let ownPath = this.path;
          let minPathLength = Math.min(globalPath.length, ownPath.length);
          let lastSharedPathCompIndex = -1;
          for (let i = 0; i < minPathLength; ++i) {
            let ownComp = ownPath.GetComponent(i);
            let otherComp = globalPath.GetComponent(i);
            if (ownComp.Equals(otherComp)) {
              lastSharedPathCompIndex = i;
            } else {
              break;
            }
          }
          if (lastSharedPathCompIndex == -1)
            return globalPath;
          let numUpwardsMoves = ownPath.componentCount - 1 - lastSharedPathCompIndex;
          let newPathComps = [];
          for (let up = 0; up < numUpwardsMoves; ++up)
            newPathComps.push(Path_1.Path.Component.ToParent());
          for (let down = lastSharedPathCompIndex + 1; down < globalPath.componentCount; ++down)
            newPathComps.push(globalPath.GetComponent(down));
          let relativePath = new Path_1.Path(newPathComps, true);
          return relativePath;
        }
        CompactPathString(otherPath) {
          let globalPathStr = null;
          let relativePathStr = null;
          if (otherPath.isRelative) {
            relativePathStr = otherPath.componentsString;
            globalPathStr = this.path.PathByAppendingPath(otherPath).componentsString;
          } else {
            let relativePath = this.ConvertPathToRelative(otherPath);
            relativePathStr = relativePath.componentsString;
            globalPathStr = otherPath.componentsString;
          }
          if (relativePathStr.length < globalPathStr.length)
            return relativePathStr;
          else
            return globalPathStr;
        }
        get rootContentContainer() {
          let ancestor = this;
          while (ancestor.parent) {
            ancestor = ancestor.parent;
          }
          return TypeAssertion_1.asOrNull(ancestor, Container_1.Container);
        }
        Copy() {
          throw Error("Not Implemented: Doesn't support copying");
        }
        // SetChild works slightly diferently in the js implementation.
        // Since we can't pass an objets property by reference, we instead pass
        // the object and the property string.
        // TODO: This method can probably be rewritten with type-safety in mind.
        SetChild(obj, prop, value) {
          if (obj[prop])
            obj[prop] = null;
          obj[prop] = value;
          if (obj[prop])
            obj[prop].parent = this;
        }
        Equals(obj) {
          return obj === this;
        }
      };
      exports.InkObject = InkObject;
    }
  });

  // node_modules/inkjs/engine/StringBuilder.js
  var require_StringBuilder = __commonJS({
    "node_modules/inkjs/engine/StringBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StringBuilder = void 0;
      var StringBuilder = class {
        constructor(str) {
          str = typeof str !== "undefined" ? str.toString() : "";
          this.string = str;
        }
        get Length() {
          return this.string.length;
        }
        Append(str) {
          if (str !== null) {
            this.string += str;
          }
        }
        AppendLine(str) {
          if (typeof str !== "undefined")
            this.Append(str);
          this.string += "\n";
        }
        AppendFormat(format, ...args) {
          this.string += format.replace(/{(\d+)}/g, (match, num) => typeof args[num] != "undefined" ? args[num] : match);
        }
        toString() {
          return this.string;
        }
        Clear() {
          this.string = "";
        }
      };
      exports.StringBuilder = StringBuilder;
    }
  });

  // node_modules/inkjs/engine/InkList.js
  var require_InkList = __commonJS({
    "node_modules/inkjs/engine/InkList.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.InkList = exports.InkListItem = void 0;
      var NullException_1 = require_NullException();
      var StringBuilder_1 = require_StringBuilder();
      var InkListItem = class {
        constructor() {
          this.originName = null;
          this.itemName = null;
          if (typeof arguments[1] !== "undefined") {
            let originName = arguments[0];
            let itemName = arguments[1];
            this.originName = originName;
            this.itemName = itemName;
          } else if (arguments[0]) {
            let fullName = arguments[0];
            let nameParts = fullName.toString().split(".");
            this.originName = nameParts[0];
            this.itemName = nameParts[1];
          }
        }
        static get Null() {
          return new InkListItem(null, null);
        }
        get isNull() {
          return this.originName == null && this.itemName == null;
        }
        get fullName() {
          return (this.originName !== null ? this.originName : "?") + "." + this.itemName;
        }
        toString() {
          return this.fullName;
        }
        Equals(obj) {
          if (obj instanceof InkListItem) {
            let otherItem = obj;
            return otherItem.itemName == this.itemName && otherItem.originName == this.originName;
          }
          return false;
        }
        // These methods did not exist in the original C# code. Their purpose is to
        // make `InkListItem` mimics the value-type semantics of the original
        // struct. Please refer to the end of this file, for a more in-depth
        // explanation.
        /**
         * Returns a shallow clone of the current instance.
         */
        copy() {
          return new InkListItem(this.originName, this.itemName);
        }
        /**
         * Returns a `SerializedInkListItem` representing the current
         * instance. The result is intended to be used as a key inside a Map.
         */
        serialized() {
          return JSON.stringify({
            originName: this.originName,
            itemName: this.itemName
          });
        }
        /**
         * Reconstructs a `InkListItem` from the given SerializedInkListItem.
         */
        static fromSerializedKey(key) {
          let obj = JSON.parse(key);
          if (!InkListItem.isLikeInkListItem(obj))
            return InkListItem.Null;
          let inkListItem = obj;
          return new InkListItem(inkListItem.originName, inkListItem.itemName);
        }
        /**
         * Determines whether the given item is sufficiently `InkListItem`-like
         * to be used as a template when reconstructing the InkListItem.
         */
        static isLikeInkListItem(item) {
          if (typeof item !== "object")
            return false;
          if (!item.hasOwnProperty("originName") || !item.hasOwnProperty("itemName"))
            return false;
          if (typeof item.originName !== "string" && typeof item.originName !== null)
            return false;
          if (typeof item.itemName !== "string" && typeof item.itemName !== null)
            return false;
          return true;
        }
      };
      exports.InkListItem = InkListItem;
      var InkList = class extends Map {
        constructor() {
          super((() => {
            if (arguments[0] instanceof InkList) {
              return arguments[0];
            } else {
              return [];
            }
          })());
          this.origins = null;
          this._originNames = [];
          if (arguments[0] instanceof InkList) {
            let otherList = arguments[0];
            let otherOriginNames = otherList.originNames;
            if (otherOriginNames !== null)
              this._originNames = otherOriginNames.slice();
            if (otherList.origins !== null) {
              this.origins = otherList.origins.slice();
            }
          } else if (typeof arguments[0] === "string") {
            let singleOriginListName = arguments[0];
            let originStory = arguments[1];
            this.SetInitialOriginName(singleOriginListName);
            if (originStory.listDefinitions === null) {
              return NullException_1.throwNullException("originStory.listDefinitions");
            }
            let def = originStory.listDefinitions.TryListGetDefinition(singleOriginListName, null);
            if (def.exists) {
              if (def.result === null) {
                return NullException_1.throwNullException("def.result");
              }
              this.origins = [def.result];
            } else {
              throw new Error("InkList origin could not be found in story when constructing new list: " + singleOriginListName);
            }
          } else if (typeof arguments[0] === "object" && arguments[0].hasOwnProperty("Key") && arguments[0].hasOwnProperty("Value")) {
            let singleElement = arguments[0];
            this.Add(singleElement.Key, singleElement.Value);
          }
        }
        static FromString(myListItem, originStory) {
          var _a;
          let listValue = (_a = originStory.listDefinitions) === null || _a === void 0 ? void 0 : _a.FindSingleItemListWithName(myListItem);
          if (listValue) {
            if (listValue.value === null) {
              return NullException_1.throwNullException("listValue.value");
            }
            return new InkList(listValue.value);
          } else {
            throw new Error("Could not find the InkListItem from the string '" + myListItem + "' to create an InkList because it doesn't exist in the original list definition in ink.");
          }
        }
        AddItem(itemOrItemName) {
          if (itemOrItemName instanceof InkListItem) {
            let item = itemOrItemName;
            if (item.originName == null) {
              this.AddItem(item.itemName);
              return;
            }
            if (this.origins === null)
              return NullException_1.throwNullException("this.origins");
            for (let origin of this.origins) {
              if (origin.name == item.originName) {
                let intVal = origin.TryGetValueForItem(item, 0);
                if (intVal.exists) {
                  this.Add(item, intVal.result);
                  return;
                } else {
                  throw new Error("Could not add the item " + item + " to this list because it doesn't exist in the original list definition in ink.");
                }
              }
            }
            throw new Error("Failed to add item to list because the item was from a new list definition that wasn't previously known to this list. Only items from previously known lists can be used, so that the int value can be found.");
          } else {
            let itemName = itemOrItemName;
            let foundListDef = null;
            if (this.origins === null)
              return NullException_1.throwNullException("this.origins");
            for (let origin of this.origins) {
              if (itemName === null)
                return NullException_1.throwNullException("itemName");
              if (origin.ContainsItemWithName(itemName)) {
                if (foundListDef != null) {
                  throw new Error("Could not add the item " + itemName + " to this list because it could come from either " + origin.name + " or " + foundListDef.name);
                } else {
                  foundListDef = origin;
                }
              }
            }
            if (foundListDef == null)
              throw new Error("Could not add the item " + itemName + " to this list because it isn't known to any list definitions previously associated with this list.");
            let item = new InkListItem(foundListDef.name, itemName);
            let itemVal = foundListDef.ValueForItem(item);
            this.Add(item, itemVal);
          }
        }
        ContainsItemNamed(itemName) {
          for (let [key] of this) {
            let item = InkListItem.fromSerializedKey(key);
            if (item.itemName == itemName)
              return true;
          }
          return false;
        }
        ContainsKey(key) {
          return this.has(key.serialized());
        }
        Add(key, value) {
          let serializedKey = key.serialized();
          if (this.has(serializedKey)) {
            throw new Error(`The Map already contains an entry for ${key}`);
          }
          this.set(serializedKey, value);
        }
        Remove(key) {
          return this.delete(key.serialized());
        }
        get Count() {
          return this.size;
        }
        get originOfMaxItem() {
          if (this.origins == null)
            return null;
          let maxOriginName = this.maxItem.Key.originName;
          let result = null;
          this.origins.every((origin) => {
            if (origin.name == maxOriginName) {
              result = origin;
              return false;
            } else
              return true;
          });
          return result;
        }
        get originNames() {
          if (this.Count > 0) {
            if (this._originNames == null && this.Count > 0)
              this._originNames = [];
            else {
              if (!this._originNames)
                this._originNames = [];
              this._originNames.length = 0;
            }
            for (let [key] of this) {
              let item = InkListItem.fromSerializedKey(key);
              if (item.originName === null)
                return NullException_1.throwNullException("item.originName");
              this._originNames.push(item.originName);
            }
          }
          return this._originNames;
        }
        SetInitialOriginName(initialOriginName) {
          this._originNames = [initialOriginName];
        }
        SetInitialOriginNames(initialOriginNames) {
          if (initialOriginNames == null)
            this._originNames = null;
          else
            this._originNames = initialOriginNames.slice();
        }
        get maxItem() {
          let max = {
            Key: InkListItem.Null,
            Value: 0
          };
          for (let [key, value] of this) {
            let item = InkListItem.fromSerializedKey(key);
            if (max.Key.isNull || value > max.Value)
              max = { Key: item, Value: value };
          }
          return max;
        }
        get minItem() {
          let min = {
            Key: InkListItem.Null,
            Value: 0
          };
          for (let [key, value] of this) {
            let item = InkListItem.fromSerializedKey(key);
            if (min.Key.isNull || value < min.Value) {
              min = { Key: item, Value: value };
            }
          }
          return min;
        }
        get inverse() {
          let list = new InkList();
          if (this.origins != null) {
            for (let origin of this.origins) {
              for (let [key, value] of origin.items) {
                let item = InkListItem.fromSerializedKey(key);
                if (!this.ContainsKey(item))
                  list.Add(item, value);
              }
            }
          }
          return list;
        }
        get all() {
          let list = new InkList();
          if (this.origins != null) {
            for (let origin of this.origins) {
              for (let [key, value] of origin.items) {
                let item = InkListItem.fromSerializedKey(key);
                list.set(item.serialized(), value);
              }
            }
          }
          return list;
        }
        Union(otherList) {
          let union = new InkList(this);
          for (let [key, value] of otherList) {
            union.set(key, value);
          }
          return union;
        }
        Intersect(otherList) {
          let intersection2 = new InkList();
          for (let [key, value] of this) {
            if (otherList.has(key))
              intersection2.set(key, value);
          }
          return intersection2;
        }
        HasIntersection(otherList) {
          for (let [key] of this) {
            if (otherList.has(key))
              return true;
          }
          return false;
        }
        Without(listToRemove) {
          let result = new InkList(this);
          for (let [key] of listToRemove) {
            result.delete(key);
          }
          return result;
        }
        Contains(what) {
          if (typeof what == "string")
            return this.ContainsItemNamed(what);
          const otherList = what;
          if (otherList.size == 0 || this.size == 0)
            return false;
          for (let [key] of otherList) {
            if (!this.has(key))
              return false;
          }
          return true;
        }
        GreaterThan(otherList) {
          if (this.Count == 0)
            return false;
          if (otherList.Count == 0)
            return true;
          return this.minItem.Value > otherList.maxItem.Value;
        }
        GreaterThanOrEquals(otherList) {
          if (this.Count == 0)
            return false;
          if (otherList.Count == 0)
            return true;
          return this.minItem.Value >= otherList.minItem.Value && this.maxItem.Value >= otherList.maxItem.Value;
        }
        LessThan(otherList) {
          if (otherList.Count == 0)
            return false;
          if (this.Count == 0)
            return true;
          return this.maxItem.Value < otherList.minItem.Value;
        }
        LessThanOrEquals(otherList) {
          if (otherList.Count == 0)
            return false;
          if (this.Count == 0)
            return true;
          return this.maxItem.Value <= otherList.maxItem.Value && this.minItem.Value <= otherList.minItem.Value;
        }
        MaxAsList() {
          if (this.Count > 0)
            return new InkList(this.maxItem);
          else
            return new InkList();
        }
        MinAsList() {
          if (this.Count > 0)
            return new InkList(this.minItem);
          else
            return new InkList();
        }
        ListWithSubRange(minBound, maxBound) {
          if (this.Count == 0)
            return new InkList();
          let ordered = this.orderedItems;
          let minValue = 0;
          let maxValue = Number.MAX_SAFE_INTEGER;
          if (Number.isInteger(minBound)) {
            minValue = minBound;
          } else {
            if (minBound instanceof InkList && minBound.Count > 0)
              minValue = minBound.minItem.Value;
          }
          if (Number.isInteger(maxBound)) {
            maxValue = maxBound;
          } else {
            if (minBound instanceof InkList && minBound.Count > 0)
              maxValue = maxBound.maxItem.Value;
          }
          let subList = new InkList();
          subList.SetInitialOriginNames(this.originNames);
          for (let item of ordered) {
            if (item.Value >= minValue && item.Value <= maxValue) {
              subList.Add(item.Key, item.Value);
            }
          }
          return subList;
        }
        Equals(otherInkList) {
          if (otherInkList instanceof InkList === false)
            return false;
          if (otherInkList.Count != this.Count)
            return false;
          for (let [key] of this) {
            if (!otherInkList.has(key))
              return false;
          }
          return true;
        }
        // GetHashCode not implemented
        get orderedItems() {
          let ordered = new Array();
          for (let [key, value] of this) {
            let item = InkListItem.fromSerializedKey(key);
            ordered.push({ Key: item, Value: value });
          }
          ordered.sort((x, y) => {
            if (x.Key.originName === null) {
              return NullException_1.throwNullException("x.Key.originName");
            }
            if (y.Key.originName === null) {
              return NullException_1.throwNullException("y.Key.originName");
            }
            if (x.Value == y.Value) {
              return x.Key.originName.localeCompare(y.Key.originName);
            } else {
              if (x.Value < y.Value)
                return -1;
              return x.Value > y.Value ? 1 : 0;
            }
          });
          return ordered;
        }
        toString() {
          let ordered = this.orderedItems;
          let sb = new StringBuilder_1.StringBuilder();
          for (let i = 0; i < ordered.length; i++) {
            if (i > 0)
              sb.Append(", ");
            let item = ordered[i].Key;
            if (item.itemName === null)
              return NullException_1.throwNullException("item.itemName");
            sb.Append(item.itemName);
          }
          return sb.toString();
        }
        // casting a InkList to a Number, for somereason, actually gives a number.
        // This messes up the type detection when creating a Value from a InkList.
        // Returning NaN here prevents that.
        valueOf() {
          return NaN;
        }
      };
      exports.InkList = InkList;
    }
  });

  // node_modules/inkjs/engine/StoryException.js
  var require_StoryException = __commonJS({
    "node_modules/inkjs/engine/StoryException.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StoryException = void 0;
      var StoryException = class extends Error {
        constructor(message) {
          super(message);
          this.useEndLineNumber = false;
          this.message = message;
          this.name = "StoryException";
        }
      };
      exports.StoryException = StoryException;
    }
  });

  // node_modules/inkjs/engine/TryGetResult.js
  var require_TryGetResult = __commonJS({
    "node_modules/inkjs/engine/TryGetResult.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.tryParseFloat = exports.tryParseInt = exports.tryGetValueFromMap = void 0;
      function tryGetValueFromMap(map, key, value) {
        if (map === null) {
          return { result: value, exists: false };
        }
        let val = map.get(key);
        if (typeof val === "undefined") {
          return { result: value, exists: false };
        } else {
          return { result: val, exists: true };
        }
      }
      exports.tryGetValueFromMap = tryGetValueFromMap;
      function tryParseInt(value, defaultValue = 0) {
        let val = parseInt(value);
        if (!Number.isNaN(val)) {
          return { result: val, exists: true };
        } else {
          return { result: defaultValue, exists: false };
        }
      }
      exports.tryParseInt = tryParseInt;
      function tryParseFloat(value, defaultValue = 0) {
        let val = parseFloat(value);
        if (!Number.isNaN(val)) {
          return { result: val, exists: true };
        } else {
          return { result: defaultValue, exists: false };
        }
      }
      exports.tryParseFloat = tryParseFloat;
    }
  });

  // node_modules/inkjs/engine/Value.js
  var require_Value = __commonJS({
    "node_modules/inkjs/engine/Value.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ValueType = exports.ListValue = exports.VariablePointerValue = exports.DivertTargetValue = exports.StringValue = exports.FloatValue = exports.IntValue = exports.BoolValue = exports.Value = exports.AbstractValue = void 0;
      var Object_1 = require_Object();
      var Path_1 = require_Path();
      var InkList_1 = require_InkList();
      var StoryException_1 = require_StoryException();
      var TypeAssertion_1 = require_TypeAssertion();
      var TryGetResult_1 = require_TryGetResult();
      var NullException_1 = require_NullException();
      var AbstractValue = class extends Object_1.InkObject {
        static Create(val, preferredNumberType) {
          if (preferredNumberType) {
            if (preferredNumberType === ValueType.Int && Number.isInteger(Number(val))) {
              return new IntValue(Number(val));
            } else if (preferredNumberType === ValueType.Float && !isNaN(val)) {
              return new FloatValue(Number(val));
            }
          }
          if (typeof val === "boolean") {
            return new BoolValue(Boolean(val));
          }
          if (typeof val === "string") {
            return new StringValue(String(val));
          } else if (Number.isInteger(Number(val))) {
            return new IntValue(Number(val));
          } else if (!isNaN(val)) {
            return new FloatValue(Number(val));
          } else if (val instanceof Path_1.Path) {
            return new DivertTargetValue(TypeAssertion_1.asOrThrows(val, Path_1.Path));
          } else if (val instanceof InkList_1.InkList) {
            return new ListValue(TypeAssertion_1.asOrThrows(val, InkList_1.InkList));
          }
          return null;
        }
        Copy() {
          return TypeAssertion_1.asOrThrows(AbstractValue.Create(this.valueObject), Object_1.InkObject);
        }
        BadCastException(targetType) {
          return new StoryException_1.StoryException("Can't cast " + this.valueObject + " from " + this.valueType + " to " + targetType);
        }
      };
      exports.AbstractValue = AbstractValue;
      var Value = class extends AbstractValue {
        constructor(val) {
          super();
          this.value = val;
        }
        get valueObject() {
          return this.value;
        }
        toString() {
          if (this.value === null)
            return NullException_1.throwNullException("Value.value");
          return this.value.toString();
        }
      };
      exports.Value = Value;
      var BoolValue = class extends Value {
        constructor(val) {
          super(val || false);
        }
        get isTruthy() {
          return Boolean(this.value);
        }
        get valueType() {
          return ValueType.Bool;
        }
        Cast(newType) {
          if (this.value === null)
            return NullException_1.throwNullException("Value.value");
          if (newType == this.valueType) {
            return this;
          }
          if (newType == ValueType.Int) {
            return new IntValue(this.value ? 1 : 0);
          }
          if (newType == ValueType.Float) {
            return new FloatValue(this.value ? 1 : 0);
          }
          if (newType == ValueType.String) {
            return new StringValue(this.value ? "true" : "false");
          }
          throw this.BadCastException(newType);
        }
        toString() {
          return this.value ? "true" : "false";
        }
      };
      exports.BoolValue = BoolValue;
      var IntValue = class extends Value {
        constructor(val) {
          super(val || 0);
        }
        get isTruthy() {
          return this.value != 0;
        }
        get valueType() {
          return ValueType.Int;
        }
        Cast(newType) {
          if (this.value === null)
            return NullException_1.throwNullException("Value.value");
          if (newType == this.valueType) {
            return this;
          }
          if (newType == ValueType.Bool) {
            return new BoolValue(this.value === 0 ? false : true);
          }
          if (newType == ValueType.Float) {
            return new FloatValue(this.value);
          }
          if (newType == ValueType.String) {
            return new StringValue("" + this.value);
          }
          throw this.BadCastException(newType);
        }
      };
      exports.IntValue = IntValue;
      var FloatValue = class extends Value {
        constructor(val) {
          super(val || 0);
        }
        get isTruthy() {
          return this.value != 0;
        }
        get valueType() {
          return ValueType.Float;
        }
        Cast(newType) {
          if (this.value === null)
            return NullException_1.throwNullException("Value.value");
          if (newType == this.valueType) {
            return this;
          }
          if (newType == ValueType.Bool) {
            return new BoolValue(this.value === 0 ? false : true);
          }
          if (newType == ValueType.Int) {
            return new IntValue(this.value);
          }
          if (newType == ValueType.String) {
            return new StringValue("" + this.value);
          }
          throw this.BadCastException(newType);
        }
      };
      exports.FloatValue = FloatValue;
      var StringValue = class extends Value {
        constructor(val) {
          super(val || "");
          this._isNewline = this.value == "\n";
          this._isInlineWhitespace = true;
          if (this.value === null)
            return NullException_1.throwNullException("Value.value");
          if (this.value.length > 0) {
            this.value.split("").every((c) => {
              if (c != " " && c != "	") {
                this._isInlineWhitespace = false;
                return false;
              }
              return true;
            });
          }
        }
        get valueType() {
          return ValueType.String;
        }
        get isTruthy() {
          if (this.value === null)
            return NullException_1.throwNullException("Value.value");
          return this.value.length > 0;
        }
        get isNewline() {
          return this._isNewline;
        }
        get isInlineWhitespace() {
          return this._isInlineWhitespace;
        }
        get isNonWhitespace() {
          return !this.isNewline && !this.isInlineWhitespace;
        }
        Cast(newType) {
          if (newType == this.valueType) {
            return this;
          }
          if (newType == ValueType.Int) {
            let parsedInt = TryGetResult_1.tryParseInt(this.value);
            if (parsedInt.exists) {
              return new IntValue(parsedInt.result);
            } else {
              throw this.BadCastException(newType);
            }
          }
          if (newType == ValueType.Float) {
            let parsedFloat = TryGetResult_1.tryParseFloat(this.value);
            if (parsedFloat.exists) {
              return new FloatValue(parsedFloat.result);
            } else {
              throw this.BadCastException(newType);
            }
          }
          throw this.BadCastException(newType);
        }
      };
      exports.StringValue = StringValue;
      var DivertTargetValue = class extends Value {
        constructor(targetPath = null) {
          super(targetPath);
        }
        get valueType() {
          return ValueType.DivertTarget;
        }
        get targetPath() {
          if (this.value === null)
            return NullException_1.throwNullException("Value.value");
          return this.value;
        }
        set targetPath(value) {
          this.value = value;
        }
        get isTruthy() {
          throw new Error("Shouldn't be checking the truthiness of a divert target");
        }
        Cast(newType) {
          if (newType == this.valueType)
            return this;
          throw this.BadCastException(newType);
        }
        toString() {
          return "DivertTargetValue(" + this.targetPath + ")";
        }
      };
      exports.DivertTargetValue = DivertTargetValue;
      var VariablePointerValue = class extends Value {
        constructor(variableName, contextIndex = -1) {
          super(variableName);
          this._contextIndex = contextIndex;
        }
        get contextIndex() {
          return this._contextIndex;
        }
        set contextIndex(value) {
          this._contextIndex = value;
        }
        get variableName() {
          if (this.value === null)
            return NullException_1.throwNullException("Value.value");
          return this.value;
        }
        set variableName(value) {
          this.value = value;
        }
        get valueType() {
          return ValueType.VariablePointer;
        }
        get isTruthy() {
          throw new Error("Shouldn't be checking the truthiness of a variable pointer");
        }
        Cast(newType) {
          if (newType == this.valueType)
            return this;
          throw this.BadCastException(newType);
        }
        toString() {
          return "VariablePointerValue(" + this.variableName + ")";
        }
        Copy() {
          return new VariablePointerValue(this.variableName, this.contextIndex);
        }
      };
      exports.VariablePointerValue = VariablePointerValue;
      var ListValue = class extends Value {
        get isTruthy() {
          if (this.value === null) {
            return NullException_1.throwNullException("this.value");
          }
          return this.value.Count > 0;
        }
        get valueType() {
          return ValueType.List;
        }
        Cast(newType) {
          if (this.value === null)
            return NullException_1.throwNullException("Value.value");
          if (newType == ValueType.Int) {
            let max = this.value.maxItem;
            if (max.Key.isNull)
              return new IntValue(0);
            else
              return new IntValue(max.Value);
          } else if (newType == ValueType.Float) {
            let max = this.value.maxItem;
            if (max.Key.isNull)
              return new FloatValue(0);
            else
              return new FloatValue(max.Value);
          } else if (newType == ValueType.String) {
            let max = this.value.maxItem;
            if (max.Key.isNull)
              return new StringValue("");
            else {
              return new StringValue(max.Key.toString());
            }
          }
          if (newType == this.valueType)
            return this;
          throw this.BadCastException(newType);
        }
        constructor(listOrSingleItem, singleValue) {
          super(null);
          if (!listOrSingleItem && !singleValue) {
            this.value = new InkList_1.InkList();
          } else if (listOrSingleItem instanceof InkList_1.InkList) {
            this.value = new InkList_1.InkList(listOrSingleItem);
          } else if (listOrSingleItem instanceof InkList_1.InkListItem && typeof singleValue === "number") {
            this.value = new InkList_1.InkList({
              Key: listOrSingleItem,
              Value: singleValue
            });
          }
        }
        static RetainListOriginsForAssignment(oldValue, newValue) {
          let oldList = TypeAssertion_1.asOrNull(oldValue, ListValue);
          let newList = TypeAssertion_1.asOrNull(newValue, ListValue);
          if (newList && newList.value === null)
            return NullException_1.throwNullException("newList.value");
          if (oldList && oldList.value === null)
            return NullException_1.throwNullException("oldList.value");
          if (oldList && newList && newList.value.Count == 0)
            newList.value.SetInitialOriginNames(oldList.value.originNames);
        }
      };
      exports.ListValue = ListValue;
      var ValueType;
      (function(ValueType2) {
        ValueType2[ValueType2["Bool"] = -1] = "Bool";
        ValueType2[ValueType2["Int"] = 0] = "Int";
        ValueType2[ValueType2["Float"] = 1] = "Float";
        ValueType2[ValueType2["List"] = 2] = "List";
        ValueType2[ValueType2["String"] = 3] = "String";
        ValueType2[ValueType2["DivertTarget"] = 4] = "DivertTarget";
        ValueType2[ValueType2["VariablePointer"] = 5] = "VariablePointer";
      })(ValueType = exports.ValueType || (exports.ValueType = {}));
    }
  });

  // node_modules/inkjs/engine/SearchResult.js
  var require_SearchResult = __commonJS({
    "node_modules/inkjs/engine/SearchResult.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SearchResult = void 0;
      var Container_1 = require_Container();
      var SearchResult = class {
        constructor() {
          this.obj = null;
          this.approximate = false;
        }
        get correctObj() {
          return this.approximate ? null : this.obj;
        }
        get container() {
          return this.obj instanceof Container_1.Container ? this.obj : null;
        }
        copy() {
          let searchResult = new SearchResult();
          searchResult.obj = this.obj;
          searchResult.approximate = this.approximate;
          return searchResult;
        }
      };
      exports.SearchResult = SearchResult;
    }
  });

  // node_modules/inkjs/engine/Container.js
  var require_Container = __commonJS({
    "node_modules/inkjs/engine/Container.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Container = void 0;
      var Value_1 = require_Value();
      var NullException_1 = require_NullException();
      var StringBuilder_1 = require_StringBuilder();
      var Object_1 = require_Object();
      var SearchResult_1 = require_SearchResult();
      var Path_1 = require_Path();
      var Debug_1 = require_Debug();
      var TryGetResult_1 = require_TryGetResult();
      var TypeAssertion_1 = require_TypeAssertion();
      var Container = class extends Object_1.InkObject {
        constructor() {
          super(...arguments);
          this.name = null;
          this._content = [];
          this.namedContent = /* @__PURE__ */ new Map();
          this.visitsShouldBeCounted = false;
          this.turnIndexShouldBeCounted = false;
          this.countingAtStartOnly = false;
          this._pathToFirstLeafContent = null;
        }
        get hasValidName() {
          return this.name != null && this.name.length > 0;
        }
        get content() {
          return this._content;
        }
        set content(value) {
          this.AddContent(value);
        }
        get namedOnlyContent() {
          let namedOnlyContentDict = /* @__PURE__ */ new Map();
          for (let [key, value] of this.namedContent) {
            let inkObject = TypeAssertion_1.asOrThrows(value, Object_1.InkObject);
            namedOnlyContentDict.set(key, inkObject);
          }
          for (let c of this.content) {
            let named = TypeAssertion_1.asINamedContentOrNull(c);
            if (named != null && named.hasValidName) {
              namedOnlyContentDict.delete(named.name);
            }
          }
          if (namedOnlyContentDict.size == 0)
            namedOnlyContentDict = null;
          return namedOnlyContentDict;
        }
        set namedOnlyContent(value) {
          let existingNamedOnly = this.namedOnlyContent;
          if (existingNamedOnly != null) {
            for (let [key] of existingNamedOnly) {
              this.namedContent.delete(key);
            }
          }
          if (value == null)
            return;
          for (let [, val] of value) {
            let named = TypeAssertion_1.asINamedContentOrNull(val);
            if (named != null)
              this.AddToNamedContentOnly(named);
          }
        }
        get countFlags() {
          let flags = 0;
          if (this.visitsShouldBeCounted)
            flags |= Container.CountFlags.Visits;
          if (this.turnIndexShouldBeCounted)
            flags |= Container.CountFlags.Turns;
          if (this.countingAtStartOnly)
            flags |= Container.CountFlags.CountStartOnly;
          if (flags == Container.CountFlags.CountStartOnly) {
            flags = 0;
          }
          return flags;
        }
        set countFlags(value) {
          let flag = value;
          if ((flag & Container.CountFlags.Visits) > 0)
            this.visitsShouldBeCounted = true;
          if ((flag & Container.CountFlags.Turns) > 0)
            this.turnIndexShouldBeCounted = true;
          if ((flag & Container.CountFlags.CountStartOnly) > 0)
            this.countingAtStartOnly = true;
        }
        get pathToFirstLeafContent() {
          if (this._pathToFirstLeafContent == null)
            this._pathToFirstLeafContent = this.path.PathByAppendingPath(this.internalPathToFirstLeafContent);
          return this._pathToFirstLeafContent;
        }
        get internalPathToFirstLeafContent() {
          let components = [];
          let container = this;
          while (container instanceof Container) {
            if (container.content.length > 0) {
              components.push(new Path_1.Path.Component(0));
              container = container.content[0];
            }
          }
          return new Path_1.Path(components);
        }
        AddContent(contentObjOrList) {
          if (contentObjOrList instanceof Array) {
            let contentList = contentObjOrList;
            for (let c of contentList) {
              this.AddContent(c);
            }
          } else {
            let contentObj = contentObjOrList;
            this._content.push(contentObj);
            if (contentObj.parent) {
              throw new Error("content is already in " + contentObj.parent);
            }
            contentObj.parent = this;
            this.TryAddNamedContent(contentObj);
          }
        }
        TryAddNamedContent(contentObj) {
          let namedContentObj = TypeAssertion_1.asINamedContentOrNull(contentObj);
          if (namedContentObj != null && namedContentObj.hasValidName) {
            this.AddToNamedContentOnly(namedContentObj);
          }
        }
        AddToNamedContentOnly(namedContentObj) {
          Debug_1.Debug.AssertType(namedContentObj, Object_1.InkObject, "Can only add Runtime.Objects to a Runtime.Container");
          let runtimeObj = TypeAssertion_1.asOrThrows(namedContentObj, Object_1.InkObject);
          runtimeObj.parent = this;
          if (namedContentObj.name === null)
            return NullException_1.throwNullException("namedContentObj.name");
          this.namedContent.set(namedContentObj.name, namedContentObj);
        }
        ContentAtPath(path, partialPathStart = 0, partialPathLength = -1) {
          if (partialPathLength == -1)
            partialPathLength = path.length;
          let result = new SearchResult_1.SearchResult();
          result.approximate = false;
          let currentContainer = this;
          let currentObj = this;
          for (let i = partialPathStart; i < partialPathLength; ++i) {
            let comp = path.GetComponent(i);
            if (currentContainer == null) {
              result.approximate = true;
              break;
            }
            let foundObj = currentContainer.ContentWithPathComponent(comp);
            if (foundObj == null) {
              result.approximate = true;
              break;
            }
            currentObj = foundObj;
            currentContainer = TypeAssertion_1.asOrNull(foundObj, Container);
          }
          result.obj = currentObj;
          return result;
        }
        InsertContent(contentObj, index) {
          this.content.splice(index, 0, contentObj);
          if (contentObj.parent) {
            throw new Error("content is already in " + contentObj.parent);
          }
          contentObj.parent = this;
          this.TryAddNamedContent(contentObj);
        }
        AddContentsOfContainer(otherContainer) {
          this.content.push(...otherContainer.content);
          for (let obj of otherContainer.content) {
            obj.parent = this;
            this.TryAddNamedContent(obj);
          }
        }
        ContentWithPathComponent(component) {
          if (component.isIndex) {
            if (component.index >= 0 && component.index < this.content.length) {
              return this.content[component.index];
            } else {
              return null;
            }
          } else if (component.isParent) {
            return this.parent;
          } else {
            if (component.name === null) {
              return NullException_1.throwNullException("component.name");
            }
            let foundContent = TryGetResult_1.tryGetValueFromMap(this.namedContent, component.name, null);
            if (foundContent.exists) {
              return TypeAssertion_1.asOrThrows(foundContent.result, Object_1.InkObject);
            } else {
              return null;
            }
          }
        }
        BuildStringOfHierarchy() {
          let sb;
          if (arguments.length == 0) {
            sb = new StringBuilder_1.StringBuilder();
            this.BuildStringOfHierarchy(sb, 0, null);
            return sb.toString();
          }
          sb = arguments[0];
          let indentation = arguments[1];
          let pointedObj = arguments[2];
          function appendIndentation() {
            const spacesPerIndent = 4;
            for (let i = 0; i < spacesPerIndent * indentation; ++i) {
              sb.Append(" ");
            }
          }
          appendIndentation();
          sb.Append("[");
          if (this.hasValidName) {
            sb.AppendFormat(" ({0})", this.name);
          }
          if (this == pointedObj) {
            sb.Append("  <---");
          }
          sb.AppendLine();
          indentation++;
          for (let i = 0; i < this.content.length; ++i) {
            let obj = this.content[i];
            if (obj instanceof Container) {
              let container = obj;
              container.BuildStringOfHierarchy(sb, indentation, pointedObj);
            } else {
              appendIndentation();
              if (obj instanceof Value_1.StringValue) {
                sb.Append('"');
                sb.Append(obj.toString().replace("\n", "\\n"));
                sb.Append('"');
              } else {
                sb.Append(obj.toString());
              }
            }
            if (i != this.content.length - 1) {
              sb.Append(",");
            }
            if (!(obj instanceof Container) && obj == pointedObj) {
              sb.Append("  <---");
            }
            sb.AppendLine();
          }
          let onlyNamed = /* @__PURE__ */ new Map();
          for (let [key, value] of this.namedContent) {
            if (this.content.indexOf(TypeAssertion_1.asOrThrows(value, Object_1.InkObject)) >= 0) {
              continue;
            } else {
              onlyNamed.set(key, value);
            }
          }
          if (onlyNamed.size > 0) {
            appendIndentation();
            sb.AppendLine("-- named: --");
            for (let [, value] of onlyNamed) {
              Debug_1.Debug.AssertType(value, Container, "Can only print out named Containers");
              let container = value;
              container.BuildStringOfHierarchy(sb, indentation, pointedObj);
              sb.AppendLine();
            }
          }
          indentation--;
          appendIndentation();
          sb.Append("]");
        }
      };
      exports.Container = Container;
      (function(Container2) {
        let CountFlags;
        (function(CountFlags2) {
          CountFlags2[CountFlags2["Visits"] = 1] = "Visits";
          CountFlags2[CountFlags2["Turns"] = 2] = "Turns";
          CountFlags2[CountFlags2["CountStartOnly"] = 4] = "CountStartOnly";
        })(CountFlags = Container2.CountFlags || (Container2.CountFlags = {}));
      })(Container = exports.Container || (exports.Container = {}));
    }
  });

  // node_modules/inkjs/engine/Glue.js
  var require_Glue = __commonJS({
    "node_modules/inkjs/engine/Glue.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Glue = void 0;
      var Object_1 = require_Object();
      var Glue = class extends Object_1.InkObject {
        toString() {
          return "Glue";
        }
      };
      exports.Glue = Glue;
    }
  });

  // node_modules/inkjs/engine/ControlCommand.js
  var require_ControlCommand = __commonJS({
    "node_modules/inkjs/engine/ControlCommand.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ControlCommand = void 0;
      var Object_1 = require_Object();
      var ControlCommand = class extends Object_1.InkObject {
        constructor(commandType = ControlCommand.CommandType.NotSet) {
          super();
          this._commandType = commandType;
        }
        get commandType() {
          return this._commandType;
        }
        Copy() {
          return new ControlCommand(this.commandType);
        }
        static EvalStart() {
          return new ControlCommand(ControlCommand.CommandType.EvalStart);
        }
        static EvalOutput() {
          return new ControlCommand(ControlCommand.CommandType.EvalOutput);
        }
        static EvalEnd() {
          return new ControlCommand(ControlCommand.CommandType.EvalEnd);
        }
        static Duplicate() {
          return new ControlCommand(ControlCommand.CommandType.Duplicate);
        }
        static PopEvaluatedValue() {
          return new ControlCommand(ControlCommand.CommandType.PopEvaluatedValue);
        }
        static PopFunction() {
          return new ControlCommand(ControlCommand.CommandType.PopFunction);
        }
        static PopTunnel() {
          return new ControlCommand(ControlCommand.CommandType.PopTunnel);
        }
        static BeginString() {
          return new ControlCommand(ControlCommand.CommandType.BeginString);
        }
        static EndString() {
          return new ControlCommand(ControlCommand.CommandType.EndString);
        }
        static NoOp() {
          return new ControlCommand(ControlCommand.CommandType.NoOp);
        }
        static ChoiceCount() {
          return new ControlCommand(ControlCommand.CommandType.ChoiceCount);
        }
        static Turns() {
          return new ControlCommand(ControlCommand.CommandType.Turns);
        }
        static TurnsSince() {
          return new ControlCommand(ControlCommand.CommandType.TurnsSince);
        }
        static ReadCount() {
          return new ControlCommand(ControlCommand.CommandType.ReadCount);
        }
        static Random() {
          return new ControlCommand(ControlCommand.CommandType.Random);
        }
        static SeedRandom() {
          return new ControlCommand(ControlCommand.CommandType.SeedRandom);
        }
        static VisitIndex() {
          return new ControlCommand(ControlCommand.CommandType.VisitIndex);
        }
        static SequenceShuffleIndex() {
          return new ControlCommand(ControlCommand.CommandType.SequenceShuffleIndex);
        }
        static StartThread() {
          return new ControlCommand(ControlCommand.CommandType.StartThread);
        }
        static Done() {
          return new ControlCommand(ControlCommand.CommandType.Done);
        }
        static End() {
          return new ControlCommand(ControlCommand.CommandType.End);
        }
        static ListFromInt() {
          return new ControlCommand(ControlCommand.CommandType.ListFromInt);
        }
        static ListRange() {
          return new ControlCommand(ControlCommand.CommandType.ListRange);
        }
        static ListRandom() {
          return new ControlCommand(ControlCommand.CommandType.ListRandom);
        }
        static BeginTag() {
          return new ControlCommand(ControlCommand.CommandType.BeginTag);
        }
        static EndTag() {
          return new ControlCommand(ControlCommand.CommandType.EndTag);
        }
        toString() {
          return this.commandType.toString();
        }
      };
      exports.ControlCommand = ControlCommand;
      (function(ControlCommand2) {
        let CommandType;
        (function(CommandType2) {
          CommandType2[CommandType2["NotSet"] = -1] = "NotSet";
          CommandType2[CommandType2["EvalStart"] = 0] = "EvalStart";
          CommandType2[CommandType2["EvalOutput"] = 1] = "EvalOutput";
          CommandType2[CommandType2["EvalEnd"] = 2] = "EvalEnd";
          CommandType2[CommandType2["Duplicate"] = 3] = "Duplicate";
          CommandType2[CommandType2["PopEvaluatedValue"] = 4] = "PopEvaluatedValue";
          CommandType2[CommandType2["PopFunction"] = 5] = "PopFunction";
          CommandType2[CommandType2["PopTunnel"] = 6] = "PopTunnel";
          CommandType2[CommandType2["BeginString"] = 7] = "BeginString";
          CommandType2[CommandType2["EndString"] = 8] = "EndString";
          CommandType2[CommandType2["NoOp"] = 9] = "NoOp";
          CommandType2[CommandType2["ChoiceCount"] = 10] = "ChoiceCount";
          CommandType2[CommandType2["Turns"] = 11] = "Turns";
          CommandType2[CommandType2["TurnsSince"] = 12] = "TurnsSince";
          CommandType2[CommandType2["ReadCount"] = 13] = "ReadCount";
          CommandType2[CommandType2["Random"] = 14] = "Random";
          CommandType2[CommandType2["SeedRandom"] = 15] = "SeedRandom";
          CommandType2[CommandType2["VisitIndex"] = 16] = "VisitIndex";
          CommandType2[CommandType2["SequenceShuffleIndex"] = 17] = "SequenceShuffleIndex";
          CommandType2[CommandType2["StartThread"] = 18] = "StartThread";
          CommandType2[CommandType2["Done"] = 19] = "Done";
          CommandType2[CommandType2["End"] = 20] = "End";
          CommandType2[CommandType2["ListFromInt"] = 21] = "ListFromInt";
          CommandType2[CommandType2["ListRange"] = 22] = "ListRange";
          CommandType2[CommandType2["ListRandom"] = 23] = "ListRandom";
          CommandType2[CommandType2["BeginTag"] = 24] = "BeginTag";
          CommandType2[CommandType2["EndTag"] = 25] = "EndTag";
          CommandType2[CommandType2["TOTAL_VALUES"] = 26] = "TOTAL_VALUES";
        })(CommandType = ControlCommand2.CommandType || (ControlCommand2.CommandType = {}));
      })(ControlCommand = exports.ControlCommand || (exports.ControlCommand = {}));
    }
  });

  // node_modules/inkjs/engine/PushPop.js
  var require_PushPop = __commonJS({
    "node_modules/inkjs/engine/PushPop.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PushPopType = void 0;
      var PushPopType;
      (function(PushPopType2) {
        PushPopType2[PushPopType2["Tunnel"] = 0] = "Tunnel";
        PushPopType2[PushPopType2["Function"] = 1] = "Function";
        PushPopType2[PushPopType2["FunctionEvaluationFromGame"] = 2] = "FunctionEvaluationFromGame";
      })(PushPopType = exports.PushPopType || (exports.PushPopType = {}));
    }
  });

  // node_modules/inkjs/engine/Pointer.js
  var require_Pointer = __commonJS({
    "node_modules/inkjs/engine/Pointer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Pointer = void 0;
      var Path_1 = require_Path();
      var Pointer = class {
        constructor() {
          this.container = null;
          this.index = -1;
          if (arguments.length === 2) {
            this.container = arguments[0];
            this.index = arguments[1];
          }
        }
        Resolve() {
          if (this.index < 0)
            return this.container;
          if (this.container == null)
            return null;
          if (this.container.content.length == 0)
            return this.container;
          if (this.index >= this.container.content.length)
            return null;
          return this.container.content[this.index];
        }
        get isNull() {
          return this.container == null;
        }
        get path() {
          if (this.isNull)
            return null;
          if (this.index >= 0)
            return this.container.path.PathByAppendingComponent(new Path_1.Path.Component(this.index));
          else
            return this.container.path;
        }
        toString() {
          if (!this.container)
            return "Ink Pointer (null)";
          return "Ink Pointer -> " + this.container.path.toString() + " -- index " + this.index;
        }
        // This method does not exist in the original C# code, but is here to maintain the
        // value semantics of Pointer.
        copy() {
          return new Pointer(this.container, this.index);
        }
        static StartOf(container) {
          return new Pointer(container, 0);
        }
        static get Null() {
          return new Pointer(null, -1);
        }
      };
      exports.Pointer = Pointer;
    }
  });

  // node_modules/inkjs/engine/Divert.js
  var require_Divert = __commonJS({
    "node_modules/inkjs/engine/Divert.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Divert = void 0;
      var Path_1 = require_Path();
      var PushPop_1 = require_PushPop();
      var StringBuilder_1 = require_StringBuilder();
      var Object_1 = require_Object();
      var Pointer_1 = require_Pointer();
      var Container_1 = require_Container();
      var NullException_1 = require_NullException();
      var Divert = class extends Object_1.InkObject {
        constructor(stackPushType) {
          super();
          this._targetPath = null;
          this._targetPointer = Pointer_1.Pointer.Null;
          this.variableDivertName = null;
          this.pushesToStack = false;
          this.stackPushType = 0;
          this.isExternal = false;
          this.externalArgs = 0;
          this.isConditional = false;
          this.pushesToStack = false;
          if (typeof stackPushType !== "undefined") {
            this.pushesToStack = true;
            this.stackPushType = stackPushType;
          }
        }
        get targetPath() {
          if (this._targetPath != null && this._targetPath.isRelative) {
            let targetObj = this.targetPointer.Resolve();
            if (targetObj) {
              this._targetPath = targetObj.path;
            }
          }
          return this._targetPath;
        }
        set targetPath(value) {
          this._targetPath = value;
          this._targetPointer = Pointer_1.Pointer.Null;
        }
        get targetPointer() {
          if (this._targetPointer.isNull) {
            let targetObj = this.ResolvePath(this._targetPath).obj;
            if (this._targetPath === null)
              return NullException_1.throwNullException("this._targetPath");
            if (this._targetPath.lastComponent === null)
              return NullException_1.throwNullException("this._targetPath.lastComponent");
            if (this._targetPath.lastComponent.isIndex) {
              if (targetObj === null)
                return NullException_1.throwNullException("targetObj");
              this._targetPointer.container = targetObj.parent instanceof Container_1.Container ? targetObj.parent : null;
              this._targetPointer.index = this._targetPath.lastComponent.index;
            } else {
              this._targetPointer = Pointer_1.Pointer.StartOf(targetObj instanceof Container_1.Container ? targetObj : null);
            }
          }
          return this._targetPointer.copy();
        }
        get targetPathString() {
          if (this.targetPath == null)
            return null;
          return this.CompactPathString(this.targetPath);
        }
        set targetPathString(value) {
          if (value == null) {
            this.targetPath = null;
          } else {
            this.targetPath = new Path_1.Path(value);
          }
        }
        get hasVariableTarget() {
          return this.variableDivertName != null;
        }
        Equals(obj) {
          let otherDivert = obj;
          if (otherDivert instanceof Divert) {
            if (this.hasVariableTarget == otherDivert.hasVariableTarget) {
              if (this.hasVariableTarget) {
                return this.variableDivertName == otherDivert.variableDivertName;
              } else {
                if (this.targetPath === null)
                  return NullException_1.throwNullException("this.targetPath");
                return this.targetPath.Equals(otherDivert.targetPath);
              }
            }
          }
          return false;
        }
        toString() {
          if (this.hasVariableTarget) {
            return "Divert(variable: " + this.variableDivertName + ")";
          } else if (this.targetPath == null) {
            return "Divert(null)";
          } else {
            let sb = new StringBuilder_1.StringBuilder();
            let targetStr = this.targetPath.toString();
            let targetLineNum = null;
            if (targetLineNum != null) {
              targetStr = "line " + targetLineNum;
            }
            sb.Append("Divert");
            if (this.isConditional)
              sb.Append("?");
            if (this.pushesToStack) {
              if (this.stackPushType == PushPop_1.PushPopType.Function) {
                sb.Append(" function");
              } else {
                sb.Append(" tunnel");
              }
            }
            sb.Append(" -> ");
            sb.Append(this.targetPathString);
            sb.Append(" (");
            sb.Append(targetStr);
            sb.Append(")");
            return sb.toString();
          }
        }
      };
      exports.Divert = Divert;
    }
  });

  // node_modules/inkjs/engine/ChoicePoint.js
  var require_ChoicePoint = __commonJS({
    "node_modules/inkjs/engine/ChoicePoint.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ChoicePoint = void 0;
      var Object_1 = require_Object();
      var Path_1 = require_Path();
      var NullException_1 = require_NullException();
      var ChoicePoint = class extends Object_1.InkObject {
        constructor(onceOnly = true) {
          super();
          this._pathOnChoice = null;
          this.hasCondition = false;
          this.hasStartContent = false;
          this.hasChoiceOnlyContent = false;
          this.isInvisibleDefault = false;
          this.onceOnly = true;
          this.onceOnly = onceOnly;
        }
        get pathOnChoice() {
          if (this._pathOnChoice != null && this._pathOnChoice.isRelative) {
            let choiceTargetObj = this.choiceTarget;
            if (choiceTargetObj) {
              this._pathOnChoice = choiceTargetObj.path;
            }
          }
          return this._pathOnChoice;
        }
        set pathOnChoice(value) {
          this._pathOnChoice = value;
        }
        get choiceTarget() {
          if (this._pathOnChoice === null)
            return NullException_1.throwNullException("ChoicePoint._pathOnChoice");
          return this.ResolvePath(this._pathOnChoice).container;
        }
        get pathStringOnChoice() {
          if (this.pathOnChoice === null)
            return NullException_1.throwNullException("ChoicePoint.pathOnChoice");
          return this.CompactPathString(this.pathOnChoice);
        }
        set pathStringOnChoice(value) {
          this.pathOnChoice = new Path_1.Path(value);
        }
        get flags() {
          let flags = 0;
          if (this.hasCondition)
            flags |= 1;
          if (this.hasStartContent)
            flags |= 2;
          if (this.hasChoiceOnlyContent)
            flags |= 4;
          if (this.isInvisibleDefault)
            flags |= 8;
          if (this.onceOnly)
            flags |= 16;
          return flags;
        }
        set flags(value) {
          this.hasCondition = (value & 1) > 0;
          this.hasStartContent = (value & 2) > 0;
          this.hasChoiceOnlyContent = (value & 4) > 0;
          this.isInvisibleDefault = (value & 8) > 0;
          this.onceOnly = (value & 16) > 0;
        }
        toString() {
          if (this.pathOnChoice === null)
            return NullException_1.throwNullException("ChoicePoint.pathOnChoice");
          let targetLineNum = null;
          let targetString = this.pathOnChoice.toString();
          if (targetLineNum != null) {
            targetString = " line " + targetLineNum + "(" + targetString + ")";
          }
          return "Choice: -> " + targetString;
        }
      };
      exports.ChoicePoint = ChoicePoint;
    }
  });

  // node_modules/inkjs/engine/VariableReference.js
  var require_VariableReference = __commonJS({
    "node_modules/inkjs/engine/VariableReference.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.VariableReference = void 0;
      var Object_1 = require_Object();
      var Path_1 = require_Path();
      var VariableReference = class extends Object_1.InkObject {
        constructor(name = null) {
          super();
          this.pathForCount = null;
          this.name = name;
        }
        get containerForCount() {
          if (this.pathForCount === null)
            return null;
          return this.ResolvePath(this.pathForCount).container;
        }
        get pathStringForCount() {
          if (this.pathForCount === null)
            return null;
          return this.CompactPathString(this.pathForCount);
        }
        set pathStringForCount(value) {
          if (value === null)
            this.pathForCount = null;
          else
            this.pathForCount = new Path_1.Path(value);
        }
        toString() {
          if (this.name != null) {
            return "var(" + this.name + ")";
          } else {
            let pathStr = this.pathStringForCount;
            return "read_count(" + pathStr + ")";
          }
        }
      };
      exports.VariableReference = VariableReference;
    }
  });

  // node_modules/inkjs/engine/VariableAssignment.js
  var require_VariableAssignment = __commonJS({
    "node_modules/inkjs/engine/VariableAssignment.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.VariableAssignment = void 0;
      var Object_1 = require_Object();
      var VariableAssignment = class extends Object_1.InkObject {
        constructor(variableName, isNewDeclaration) {
          super();
          this.variableName = variableName || null;
          this.isNewDeclaration = !!isNewDeclaration;
          this.isGlobal = false;
        }
        toString() {
          return "VarAssign to " + this.variableName;
        }
      };
      exports.VariableAssignment = VariableAssignment;
    }
  });

  // node_modules/inkjs/engine/Void.js
  var require_Void = __commonJS({
    "node_modules/inkjs/engine/Void.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Void = void 0;
      var Object_1 = require_Object();
      var Void = class extends Object_1.InkObject {
      };
      exports.Void = Void;
    }
  });

  // node_modules/inkjs/engine/NativeFunctionCall.js
  var require_NativeFunctionCall = __commonJS({
    "node_modules/inkjs/engine/NativeFunctionCall.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NativeFunctionCall = void 0;
      var Value_1 = require_Value();
      var StoryException_1 = require_StoryException();
      var Void_1 = require_Void();
      var InkList_1 = require_InkList();
      var Object_1 = require_Object();
      var TypeAssertion_1 = require_TypeAssertion();
      var NullException_1 = require_NullException();
      var NativeFunctionCall = class extends Object_1.InkObject {
        constructor() {
          super();
          this._name = null;
          this._numberOfParameters = 0;
          this._prototype = null;
          this._isPrototype = false;
          this._operationFuncs = null;
          if (arguments.length === 0) {
            NativeFunctionCall.GenerateNativeFunctionsIfNecessary();
          } else if (arguments.length === 1) {
            let name = arguments[0];
            NativeFunctionCall.GenerateNativeFunctionsIfNecessary();
            this.name = name;
          } else if (arguments.length === 2) {
            let name = arguments[0];
            let numberOfParameters = arguments[1];
            this._isPrototype = true;
            this.name = name;
            this.numberOfParameters = numberOfParameters;
          }
        }
        static CallWithName(functionName) {
          return new NativeFunctionCall(functionName);
        }
        static CallExistsWithName(functionName) {
          this.GenerateNativeFunctionsIfNecessary();
          return this._nativeFunctions.get(functionName);
        }
        get name() {
          if (this._name === null)
            return NullException_1.throwNullException("NativeFunctionCall._name");
          return this._name;
        }
        set name(value) {
          this._name = value;
          if (!this._isPrototype) {
            if (NativeFunctionCall._nativeFunctions === null)
              NullException_1.throwNullException("NativeFunctionCall._nativeFunctions");
            else
              this._prototype = NativeFunctionCall._nativeFunctions.get(this._name) || null;
          }
        }
        get numberOfParameters() {
          if (this._prototype) {
            return this._prototype.numberOfParameters;
          } else {
            return this._numberOfParameters;
          }
        }
        set numberOfParameters(value) {
          this._numberOfParameters = value;
        }
        Call(parameters) {
          if (this._prototype) {
            return this._prototype.Call(parameters);
          }
          if (this.numberOfParameters != parameters.length) {
            throw new Error("Unexpected number of parameters");
          }
          let hasList = false;
          for (let p of parameters) {
            if (p instanceof Void_1.Void)
              throw new StoryException_1.StoryException('Attempting to perform operation on a void value. Did you forget to "return" a value from a function you called here?');
            if (p instanceof Value_1.ListValue)
              hasList = true;
          }
          if (parameters.length == 2 && hasList) {
            return this.CallBinaryListOperation(parameters);
          }
          let coercedParams = this.CoerceValuesToSingleType(parameters);
          let coercedType = coercedParams[0].valueType;
          if (coercedType == Value_1.ValueType.Int) {
            return this.CallType(coercedParams);
          } else if (coercedType == Value_1.ValueType.Float) {
            return this.CallType(coercedParams);
          } else if (coercedType == Value_1.ValueType.String) {
            return this.CallType(coercedParams);
          } else if (coercedType == Value_1.ValueType.DivertTarget) {
            return this.CallType(coercedParams);
          } else if (coercedType == Value_1.ValueType.List) {
            return this.CallType(coercedParams);
          }
          return null;
        }
        CallType(parametersOfSingleType) {
          let param1 = TypeAssertion_1.asOrThrows(parametersOfSingleType[0], Value_1.Value);
          let valType = param1.valueType;
          let val1 = param1;
          let paramCount = parametersOfSingleType.length;
          if (paramCount == 2 || paramCount == 1) {
            if (this._operationFuncs === null)
              return NullException_1.throwNullException("NativeFunctionCall._operationFuncs");
            let opForTypeObj = this._operationFuncs.get(valType);
            if (!opForTypeObj) {
              const key = Value_1.ValueType[valType];
              throw new StoryException_1.StoryException("Cannot perform operation " + this.name + " on " + key);
            }
            if (paramCount == 2) {
              let param2 = TypeAssertion_1.asOrThrows(parametersOfSingleType[1], Value_1.Value);
              let val2 = param2;
              let opForType = opForTypeObj;
              if (val1.value === null || val2.value === null)
                return NullException_1.throwNullException("NativeFunctionCall.Call BinaryOp values");
              let resultVal = opForType(val1.value, val2.value);
              return Value_1.Value.Create(resultVal);
            } else {
              let opForType = opForTypeObj;
              if (val1.value === null)
                return NullException_1.throwNullException("NativeFunctionCall.Call UnaryOp value");
              let resultVal = opForType(val1.value);
              if (this.name === NativeFunctionCall.Int) {
                return Value_1.Value.Create(resultVal, Value_1.ValueType.Int);
              } else if (this.name === NativeFunctionCall.Float) {
                return Value_1.Value.Create(resultVal, Value_1.ValueType.Float);
              } else {
                return Value_1.Value.Create(resultVal, param1.valueType);
              }
            }
          } else {
            throw new Error("Unexpected number of parameters to NativeFunctionCall: " + parametersOfSingleType.length);
          }
        }
        CallBinaryListOperation(parameters) {
          if ((this.name == "+" || this.name == "-") && parameters[0] instanceof Value_1.ListValue && parameters[1] instanceof Value_1.IntValue)
            return this.CallListIncrementOperation(parameters);
          let v1 = TypeAssertion_1.asOrThrows(parameters[0], Value_1.Value);
          let v2 = TypeAssertion_1.asOrThrows(parameters[1], Value_1.Value);
          if ((this.name == "&&" || this.name == "||") && (v1.valueType != Value_1.ValueType.List || v2.valueType != Value_1.ValueType.List)) {
            if (this._operationFuncs === null)
              return NullException_1.throwNullException("NativeFunctionCall._operationFuncs");
            let op = this._operationFuncs.get(Value_1.ValueType.Int);
            if (op === null)
              return NullException_1.throwNullException("NativeFunctionCall.CallBinaryListOperation op");
            let result = TypeAssertion_1.asBooleanOrThrows(op(v1.isTruthy ? 1 : 0, v2.isTruthy ? 1 : 0));
            return new Value_1.BoolValue(result);
          }
          if (v1.valueType == Value_1.ValueType.List && v2.valueType == Value_1.ValueType.List)
            return this.CallType([v1, v2]);
          throw new StoryException_1.StoryException("Can not call use " + this.name + " operation on " + Value_1.ValueType[v1.valueType] + " and " + Value_1.ValueType[v2.valueType]);
        }
        CallListIncrementOperation(listIntParams) {
          let listVal = TypeAssertion_1.asOrThrows(listIntParams[0], Value_1.ListValue);
          let intVal = TypeAssertion_1.asOrThrows(listIntParams[1], Value_1.IntValue);
          let resultInkList = new InkList_1.InkList();
          if (listVal.value === null)
            return NullException_1.throwNullException("NativeFunctionCall.CallListIncrementOperation listVal.value");
          for (let [listItemKey, listItemValue] of listVal.value) {
            let listItem = InkList_1.InkListItem.fromSerializedKey(listItemKey);
            if (this._operationFuncs === null)
              return NullException_1.throwNullException("NativeFunctionCall._operationFuncs");
            let intOp = this._operationFuncs.get(Value_1.ValueType.Int);
            if (intVal.value === null)
              return NullException_1.throwNullException("NativeFunctionCall.CallListIncrementOperation intVal.value");
            let targetInt = intOp(listItemValue, intVal.value);
            let itemOrigin = null;
            if (listVal.value.origins === null)
              return NullException_1.throwNullException("NativeFunctionCall.CallListIncrementOperation listVal.value.origins");
            for (let origin of listVal.value.origins) {
              if (origin.name == listItem.originName) {
                itemOrigin = origin;
                break;
              }
            }
            if (itemOrigin != null) {
              let incrementedItem = itemOrigin.TryGetItemWithValue(targetInt, InkList_1.InkListItem.Null);
              if (incrementedItem.exists)
                resultInkList.Add(incrementedItem.result, targetInt);
            }
          }
          return new Value_1.ListValue(resultInkList);
        }
        CoerceValuesToSingleType(parametersIn) {
          let valType = Value_1.ValueType.Int;
          let specialCaseList = null;
          for (let obj of parametersIn) {
            let val = TypeAssertion_1.asOrThrows(obj, Value_1.Value);
            if (val.valueType > valType) {
              valType = val.valueType;
            }
            if (val.valueType == Value_1.ValueType.List) {
              specialCaseList = TypeAssertion_1.asOrNull(val, Value_1.ListValue);
            }
          }
          let parametersOut = [];
          if (Value_1.ValueType[valType] == Value_1.ValueType[Value_1.ValueType.List]) {
            for (let inkObjectVal of parametersIn) {
              let val = TypeAssertion_1.asOrThrows(inkObjectVal, Value_1.Value);
              if (val.valueType == Value_1.ValueType.List) {
                parametersOut.push(val);
              } else if (val.valueType == Value_1.ValueType.Int) {
                let intVal = parseInt(val.valueObject);
                specialCaseList = TypeAssertion_1.asOrThrows(specialCaseList, Value_1.ListValue);
                if (specialCaseList.value === null)
                  return NullException_1.throwNullException("NativeFunctionCall.CoerceValuesToSingleType specialCaseList.value");
                let list = specialCaseList.value.originOfMaxItem;
                if (list === null)
                  return NullException_1.throwNullException("NativeFunctionCall.CoerceValuesToSingleType list");
                let item = list.TryGetItemWithValue(intVal, InkList_1.InkListItem.Null);
                if (item.exists) {
                  let castedValue = new Value_1.ListValue(item.result, intVal);
                  parametersOut.push(castedValue);
                } else
                  throw new StoryException_1.StoryException("Could not find List item with the value " + intVal + " in " + list.name);
              } else {
                const key = Value_1.ValueType[val.valueType];
                throw new StoryException_1.StoryException("Cannot mix Lists and " + key + " values in this operation");
              }
            }
          } else {
            for (let inkObjectVal of parametersIn) {
              let val = TypeAssertion_1.asOrThrows(inkObjectVal, Value_1.Value);
              let castedValue = val.Cast(valType);
              parametersOut.push(castedValue);
            }
          }
          return parametersOut;
        }
        static Identity(t) {
          return t;
        }
        static GenerateNativeFunctionsIfNecessary() {
          if (this._nativeFunctions == null) {
            this._nativeFunctions = /* @__PURE__ */ new Map();
            this.AddIntBinaryOp(this.Add, (x, y) => x + y);
            this.AddIntBinaryOp(this.Subtract, (x, y) => x - y);
            this.AddIntBinaryOp(this.Multiply, (x, y) => x * y);
            this.AddIntBinaryOp(this.Divide, (x, y) => Math.floor(x / y));
            this.AddIntBinaryOp(this.Mod, (x, y) => x % y);
            this.AddIntUnaryOp(this.Negate, (x) => -x);
            this.AddIntBinaryOp(this.Equal, (x, y) => x == y);
            this.AddIntBinaryOp(this.Greater, (x, y) => x > y);
            this.AddIntBinaryOp(this.Less, (x, y) => x < y);
            this.AddIntBinaryOp(this.GreaterThanOrEquals, (x, y) => x >= y);
            this.AddIntBinaryOp(this.LessThanOrEquals, (x, y) => x <= y);
            this.AddIntBinaryOp(this.NotEquals, (x, y) => x != y);
            this.AddIntUnaryOp(this.Not, (x) => x == 0);
            this.AddIntBinaryOp(this.And, (x, y) => x != 0 && y != 0);
            this.AddIntBinaryOp(this.Or, (x, y) => x != 0 || y != 0);
            this.AddIntBinaryOp(this.Max, (x, y) => Math.max(x, y));
            this.AddIntBinaryOp(this.Min, (x, y) => Math.min(x, y));
            this.AddIntBinaryOp(this.Pow, (x, y) => Math.pow(x, y));
            this.AddIntUnaryOp(this.Floor, NativeFunctionCall.Identity);
            this.AddIntUnaryOp(this.Ceiling, NativeFunctionCall.Identity);
            this.AddIntUnaryOp(this.Int, NativeFunctionCall.Identity);
            this.AddIntUnaryOp(this.Float, (x) => x);
            this.AddFloatBinaryOp(this.Add, (x, y) => x + y);
            this.AddFloatBinaryOp(this.Subtract, (x, y) => x - y);
            this.AddFloatBinaryOp(this.Multiply, (x, y) => x * y);
            this.AddFloatBinaryOp(this.Divide, (x, y) => x / y);
            this.AddFloatBinaryOp(this.Mod, (x, y) => x % y);
            this.AddFloatUnaryOp(this.Negate, (x) => -x);
            this.AddFloatBinaryOp(this.Equal, (x, y) => x == y);
            this.AddFloatBinaryOp(this.Greater, (x, y) => x > y);
            this.AddFloatBinaryOp(this.Less, (x, y) => x < y);
            this.AddFloatBinaryOp(this.GreaterThanOrEquals, (x, y) => x >= y);
            this.AddFloatBinaryOp(this.LessThanOrEquals, (x, y) => x <= y);
            this.AddFloatBinaryOp(this.NotEquals, (x, y) => x != y);
            this.AddFloatUnaryOp(this.Not, (x) => x == 0);
            this.AddFloatBinaryOp(this.And, (x, y) => x != 0 && y != 0);
            this.AddFloatBinaryOp(this.Or, (x, y) => x != 0 || y != 0);
            this.AddFloatBinaryOp(this.Max, (x, y) => Math.max(x, y));
            this.AddFloatBinaryOp(this.Min, (x, y) => Math.min(x, y));
            this.AddFloatBinaryOp(this.Pow, (x, y) => Math.pow(x, y));
            this.AddFloatUnaryOp(this.Floor, (x) => Math.floor(x));
            this.AddFloatUnaryOp(this.Ceiling, (x) => Math.ceil(x));
            this.AddFloatUnaryOp(this.Int, (x) => Math.floor(x));
            this.AddFloatUnaryOp(this.Float, NativeFunctionCall.Identity);
            this.AddStringBinaryOp(this.Add, (x, y) => x + y);
            this.AddStringBinaryOp(this.Equal, (x, y) => x === y);
            this.AddStringBinaryOp(this.NotEquals, (x, y) => !(x === y));
            this.AddStringBinaryOp(this.Has, (x, y) => x.includes(y));
            this.AddStringBinaryOp(this.Hasnt, (x, y) => !x.includes(y));
            this.AddListBinaryOp(this.Add, (x, y) => x.Union(y));
            this.AddListBinaryOp(this.Subtract, (x, y) => x.Without(y));
            this.AddListBinaryOp(this.Has, (x, y) => x.Contains(y));
            this.AddListBinaryOp(this.Hasnt, (x, y) => !x.Contains(y));
            this.AddListBinaryOp(this.Intersect, (x, y) => x.Intersect(y));
            this.AddListBinaryOp(this.Equal, (x, y) => x.Equals(y));
            this.AddListBinaryOp(this.Greater, (x, y) => x.GreaterThan(y));
            this.AddListBinaryOp(this.Less, (x, y) => x.LessThan(y));
            this.AddListBinaryOp(this.GreaterThanOrEquals, (x, y) => x.GreaterThanOrEquals(y));
            this.AddListBinaryOp(this.LessThanOrEquals, (x, y) => x.LessThanOrEquals(y));
            this.AddListBinaryOp(this.NotEquals, (x, y) => !x.Equals(y));
            this.AddListBinaryOp(this.And, (x, y) => x.Count > 0 && y.Count > 0);
            this.AddListBinaryOp(this.Or, (x, y) => x.Count > 0 || y.Count > 0);
            this.AddListUnaryOp(this.Not, (x) => x.Count == 0 ? 1 : 0);
            this.AddListUnaryOp(this.Invert, (x) => x.inverse);
            this.AddListUnaryOp(this.All, (x) => x.all);
            this.AddListUnaryOp(this.ListMin, (x) => x.MinAsList());
            this.AddListUnaryOp(this.ListMax, (x) => x.MaxAsList());
            this.AddListUnaryOp(this.Count, (x) => x.Count);
            this.AddListUnaryOp(this.ValueOfList, (x) => x.maxItem.Value);
            let divertTargetsEqual = (d1, d2) => d1.Equals(d2);
            let divertTargetsNotEqual = (d1, d2) => !d1.Equals(d2);
            this.AddOpToNativeFunc(this.Equal, 2, Value_1.ValueType.DivertTarget, divertTargetsEqual);
            this.AddOpToNativeFunc(this.NotEquals, 2, Value_1.ValueType.DivertTarget, divertTargetsNotEqual);
          }
        }
        AddOpFuncForType(valType, op) {
          if (this._operationFuncs == null) {
            this._operationFuncs = /* @__PURE__ */ new Map();
          }
          this._operationFuncs.set(valType, op);
        }
        static AddOpToNativeFunc(name, args, valType, op) {
          if (this._nativeFunctions === null)
            return NullException_1.throwNullException("NativeFunctionCall._nativeFunctions");
          let nativeFunc = this._nativeFunctions.get(name);
          if (!nativeFunc) {
            nativeFunc = new NativeFunctionCall(name, args);
            this._nativeFunctions.set(name, nativeFunc);
          }
          nativeFunc.AddOpFuncForType(valType, op);
        }
        static AddIntBinaryOp(name, op) {
          this.AddOpToNativeFunc(name, 2, Value_1.ValueType.Int, op);
        }
        static AddIntUnaryOp(name, op) {
          this.AddOpToNativeFunc(name, 1, Value_1.ValueType.Int, op);
        }
        static AddFloatBinaryOp(name, op) {
          this.AddOpToNativeFunc(name, 2, Value_1.ValueType.Float, op);
        }
        static AddFloatUnaryOp(name, op) {
          this.AddOpToNativeFunc(name, 1, Value_1.ValueType.Float, op);
        }
        static AddStringBinaryOp(name, op) {
          this.AddOpToNativeFunc(name, 2, Value_1.ValueType.String, op);
        }
        static AddListBinaryOp(name, op) {
          this.AddOpToNativeFunc(name, 2, Value_1.ValueType.List, op);
        }
        static AddListUnaryOp(name, op) {
          this.AddOpToNativeFunc(name, 1, Value_1.ValueType.List, op);
        }
        toString() {
          return 'Native "' + this.name + '"';
        }
      };
      exports.NativeFunctionCall = NativeFunctionCall;
      NativeFunctionCall.Add = "+";
      NativeFunctionCall.Subtract = "-";
      NativeFunctionCall.Divide = "/";
      NativeFunctionCall.Multiply = "*";
      NativeFunctionCall.Mod = "%";
      NativeFunctionCall.Negate = "_";
      NativeFunctionCall.Equal = "==";
      NativeFunctionCall.Greater = ">";
      NativeFunctionCall.Less = "<";
      NativeFunctionCall.GreaterThanOrEquals = ">=";
      NativeFunctionCall.LessThanOrEquals = "<=";
      NativeFunctionCall.NotEquals = "!=";
      NativeFunctionCall.Not = "!";
      NativeFunctionCall.And = "&&";
      NativeFunctionCall.Or = "||";
      NativeFunctionCall.Min = "MIN";
      NativeFunctionCall.Max = "MAX";
      NativeFunctionCall.Pow = "POW";
      NativeFunctionCall.Floor = "FLOOR";
      NativeFunctionCall.Ceiling = "CEILING";
      NativeFunctionCall.Int = "INT";
      NativeFunctionCall.Float = "FLOAT";
      NativeFunctionCall.Has = "?";
      NativeFunctionCall.Hasnt = "!?";
      NativeFunctionCall.Intersect = "^";
      NativeFunctionCall.ListMin = "LIST_MIN";
      NativeFunctionCall.ListMax = "LIST_MAX";
      NativeFunctionCall.All = "LIST_ALL";
      NativeFunctionCall.Count = "LIST_COUNT";
      NativeFunctionCall.ValueOfList = "LIST_VALUE";
      NativeFunctionCall.Invert = "LIST_INVERT";
      NativeFunctionCall._nativeFunctions = null;
    }
  });

  // node_modules/inkjs/engine/Tag.js
  var require_Tag = __commonJS({
    "node_modules/inkjs/engine/Tag.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Tag = void 0;
      var Object_1 = require_Object();
      var Tag = class extends Object_1.InkObject {
        constructor(tagText) {
          super();
          this.text = tagText.toString() || "";
        }
        toString() {
          return "# " + this.text;
        }
      };
      exports.Tag = Tag;
    }
  });

  // node_modules/inkjs/engine/Choice.js
  var require_Choice = __commonJS({
    "node_modules/inkjs/engine/Choice.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Choice = void 0;
      var Path_1 = require_Path();
      var NullException_1 = require_NullException();
      var Object_1 = require_Object();
      var Choice = class extends Object_1.InkObject {
        constructor() {
          super(...arguments);
          this.text = "";
          this.index = 0;
          this.threadAtGeneration = null;
          this.sourcePath = "";
          this.targetPath = null;
          this.isInvisibleDefault = false;
          this.tags = null;
          this.originalThreadIndex = 0;
        }
        get pathStringOnChoice() {
          if (this.targetPath === null)
            return NullException_1.throwNullException("Choice.targetPath");
          return this.targetPath.toString();
        }
        set pathStringOnChoice(value) {
          this.targetPath = new Path_1.Path(value);
        }
      };
      exports.Choice = Choice;
    }
  });

  // node_modules/inkjs/engine/ListDefinition.js
  var require_ListDefinition = __commonJS({
    "node_modules/inkjs/engine/ListDefinition.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ListDefinition = void 0;
      var InkList_1 = require_InkList();
      var ListDefinition = class {
        constructor(name, items) {
          this._name = name || "";
          this._items = null;
          this._itemNameToValues = items || /* @__PURE__ */ new Map();
        }
        get name() {
          return this._name;
        }
        get items() {
          if (this._items == null) {
            this._items = /* @__PURE__ */ new Map();
            for (let [key, value] of this._itemNameToValues) {
              let item = new InkList_1.InkListItem(this.name, key);
              this._items.set(item.serialized(), value);
            }
          }
          return this._items;
        }
        ValueForItem(item) {
          if (!item.itemName)
            return 0;
          let intVal = this._itemNameToValues.get(item.itemName);
          if (typeof intVal !== "undefined")
            return intVal;
          else
            return 0;
        }
        ContainsItem(item) {
          if (!item.itemName)
            return false;
          if (item.originName != this.name)
            return false;
          return this._itemNameToValues.has(item.itemName);
        }
        ContainsItemWithName(itemName) {
          return this._itemNameToValues.has(itemName);
        }
        TryGetItemWithValue(val, item) {
          for (let [key, value] of this._itemNameToValues) {
            if (value == val) {
              item = new InkList_1.InkListItem(this.name, key);
              return { result: item, exists: true };
            }
          }
          item = InkList_1.InkListItem.Null;
          return { result: item, exists: false };
        }
        TryGetValueForItem(item, intVal) {
          if (!item.itemName)
            return { result: 0, exists: false };
          let value = this._itemNameToValues.get(item.itemName);
          if (!value)
            return { result: 0, exists: false };
          return { result: value, exists: true };
        }
      };
      exports.ListDefinition = ListDefinition;
    }
  });

  // node_modules/inkjs/engine/ListDefinitionsOrigin.js
  var require_ListDefinitionsOrigin = __commonJS({
    "node_modules/inkjs/engine/ListDefinitionsOrigin.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ListDefinitionsOrigin = void 0;
      var InkList_1 = require_InkList();
      var Value_1 = require_Value();
      var NullException_1 = require_NullException();
      var ListDefinitionsOrigin = class {
        constructor(lists) {
          this._lists = /* @__PURE__ */ new Map();
          this._allUnambiguousListValueCache = /* @__PURE__ */ new Map();
          for (let list of lists) {
            this._lists.set(list.name, list);
            for (let [key, val] of list.items) {
              let item = InkList_1.InkListItem.fromSerializedKey(key);
              let listValue = new Value_1.ListValue(item, val);
              if (!item.itemName) {
                throw new Error("item.itemName is null or undefined.");
              }
              this._allUnambiguousListValueCache.set(item.itemName, listValue);
              this._allUnambiguousListValueCache.set(item.fullName, listValue);
            }
          }
        }
        get lists() {
          let listOfLists = [];
          for (let [, value] of this._lists) {
            listOfLists.push(value);
          }
          return listOfLists;
        }
        TryListGetDefinition(name, def) {
          if (name === null) {
            return { result: def, exists: false };
          }
          let definition = this._lists.get(name);
          if (!definition)
            return { result: def, exists: false };
          return { result: definition, exists: true };
        }
        FindSingleItemListWithName(name) {
          if (name === null) {
            return NullException_1.throwNullException("name");
          }
          let val = this._allUnambiguousListValueCache.get(name);
          if (typeof val !== "undefined") {
            return val;
          }
          return null;
        }
      };
      exports.ListDefinitionsOrigin = ListDefinitionsOrigin;
    }
  });

  // node_modules/inkjs/engine/JsonSerialisation.js
  var require_JsonSerialisation = __commonJS({
    "node_modules/inkjs/engine/JsonSerialisation.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.JsonSerialisation = void 0;
      var Container_1 = require_Container();
      var Value_1 = require_Value();
      var Glue_1 = require_Glue();
      var ControlCommand_1 = require_ControlCommand();
      var PushPop_1 = require_PushPop();
      var Divert_1 = require_Divert();
      var ChoicePoint_1 = require_ChoicePoint();
      var VariableReference_1 = require_VariableReference();
      var VariableAssignment_1 = require_VariableAssignment();
      var NativeFunctionCall_1 = require_NativeFunctionCall();
      var Void_1 = require_Void();
      var Tag_1 = require_Tag();
      var Path_1 = require_Path();
      var Choice_1 = require_Choice();
      var ListDefinition_1 = require_ListDefinition();
      var ListDefinitionsOrigin_1 = require_ListDefinitionsOrigin();
      var InkList_1 = require_InkList();
      var TypeAssertion_1 = require_TypeAssertion();
      var NullException_1 = require_NullException();
      var JsonSerialisation = class {
        static JArrayToRuntimeObjList(jArray, skipLast = false) {
          let count = jArray.length;
          if (skipLast)
            count--;
          let list = [];
          for (let i = 0; i < count; i++) {
            let jTok = jArray[i];
            let runtimeObj = this.JTokenToRuntimeObject(jTok);
            if (runtimeObj === null) {
              return NullException_1.throwNullException("runtimeObj");
            }
            list.push(runtimeObj);
          }
          return list;
        }
        static WriteDictionaryRuntimeObjs(writer, dictionary) {
          writer.WriteObjectStart();
          for (let [key, value] of dictionary) {
            writer.WritePropertyStart(key);
            this.WriteRuntimeObject(writer, value);
            writer.WritePropertyEnd();
          }
          writer.WriteObjectEnd();
        }
        static WriteListRuntimeObjs(writer, list) {
          writer.WriteArrayStart();
          for (let value of list) {
            this.WriteRuntimeObject(writer, value);
          }
          writer.WriteArrayEnd();
        }
        static WriteIntDictionary(writer, dict) {
          writer.WriteObjectStart();
          for (let [key, value] of dict) {
            writer.WriteIntProperty(key, value);
          }
          writer.WriteObjectEnd();
        }
        static WriteRuntimeObject(writer, obj) {
          let container = TypeAssertion_1.asOrNull(obj, Container_1.Container);
          if (container) {
            this.WriteRuntimeContainer(writer, container);
            return;
          }
          let divert = TypeAssertion_1.asOrNull(obj, Divert_1.Divert);
          if (divert) {
            let divTypeKey = "->";
            if (divert.isExternal) {
              divTypeKey = "x()";
            } else if (divert.pushesToStack) {
              if (divert.stackPushType == PushPop_1.PushPopType.Function) {
                divTypeKey = "f()";
              } else if (divert.stackPushType == PushPop_1.PushPopType.Tunnel) {
                divTypeKey = "->t->";
              }
            }
            let targetStr;
            if (divert.hasVariableTarget) {
              targetStr = divert.variableDivertName;
            } else {
              targetStr = divert.targetPathString;
            }
            writer.WriteObjectStart();
            writer.WriteProperty(divTypeKey, targetStr);
            if (divert.hasVariableTarget) {
              writer.WriteProperty("var", true);
            }
            if (divert.isConditional) {
              writer.WriteProperty("c", true);
            }
            if (divert.externalArgs > 0) {
              writer.WriteIntProperty("exArgs", divert.externalArgs);
            }
            writer.WriteObjectEnd();
            return;
          }
          let choicePoint = TypeAssertion_1.asOrNull(obj, ChoicePoint_1.ChoicePoint);
          if (choicePoint) {
            writer.WriteObjectStart();
            writer.WriteProperty("*", choicePoint.pathStringOnChoice);
            writer.WriteIntProperty("flg", choicePoint.flags);
            writer.WriteObjectEnd();
            return;
          }
          let boolVal = TypeAssertion_1.asOrNull(obj, Value_1.BoolValue);
          if (boolVal) {
            writer.WriteBool(boolVal.value);
            return;
          }
          let intVal = TypeAssertion_1.asOrNull(obj, Value_1.IntValue);
          if (intVal) {
            writer.WriteInt(intVal.value);
            return;
          }
          let floatVal = TypeAssertion_1.asOrNull(obj, Value_1.FloatValue);
          if (floatVal) {
            writer.WriteFloat(floatVal.value);
            return;
          }
          let strVal = TypeAssertion_1.asOrNull(obj, Value_1.StringValue);
          if (strVal) {
            if (strVal.isNewline) {
              writer.Write("\n", false);
            } else {
              writer.WriteStringStart();
              writer.WriteStringInner("^");
              writer.WriteStringInner(strVal.value);
              writer.WriteStringEnd();
            }
            return;
          }
          let listVal = TypeAssertion_1.asOrNull(obj, Value_1.ListValue);
          if (listVal) {
            this.WriteInkList(writer, listVal);
            return;
          }
          let divTargetVal = TypeAssertion_1.asOrNull(obj, Value_1.DivertTargetValue);
          if (divTargetVal) {
            writer.WriteObjectStart();
            if (divTargetVal.value === null) {
              return NullException_1.throwNullException("divTargetVal.value");
            }
            writer.WriteProperty("^->", divTargetVal.value.componentsString);
            writer.WriteObjectEnd();
            return;
          }
          let varPtrVal = TypeAssertion_1.asOrNull(obj, Value_1.VariablePointerValue);
          if (varPtrVal) {
            writer.WriteObjectStart();
            writer.WriteProperty("^var", varPtrVal.value);
            writer.WriteIntProperty("ci", varPtrVal.contextIndex);
            writer.WriteObjectEnd();
            return;
          }
          let glue = TypeAssertion_1.asOrNull(obj, Glue_1.Glue);
          if (glue) {
            writer.Write("<>");
            return;
          }
          let controlCmd = TypeAssertion_1.asOrNull(obj, ControlCommand_1.ControlCommand);
          if (controlCmd) {
            writer.Write(JsonSerialisation._controlCommandNames[controlCmd.commandType]);
            return;
          }
          let nativeFunc = TypeAssertion_1.asOrNull(obj, NativeFunctionCall_1.NativeFunctionCall);
          if (nativeFunc) {
            let name = nativeFunc.name;
            if (name == "^")
              name = "L^";
            writer.Write(name);
            return;
          }
          let varRef = TypeAssertion_1.asOrNull(obj, VariableReference_1.VariableReference);
          if (varRef) {
            writer.WriteObjectStart();
            let readCountPath = varRef.pathStringForCount;
            if (readCountPath != null) {
              writer.WriteProperty("CNT?", readCountPath);
            } else {
              writer.WriteProperty("VAR?", varRef.name);
            }
            writer.WriteObjectEnd();
            return;
          }
          let varAss = TypeAssertion_1.asOrNull(obj, VariableAssignment_1.VariableAssignment);
          if (varAss) {
            writer.WriteObjectStart();
            let key = varAss.isGlobal ? "VAR=" : "temp=";
            writer.WriteProperty(key, varAss.variableName);
            if (!varAss.isNewDeclaration)
              writer.WriteProperty("re", true);
            writer.WriteObjectEnd();
            return;
          }
          let voidObj = TypeAssertion_1.asOrNull(obj, Void_1.Void);
          if (voidObj) {
            writer.Write("void");
            return;
          }
          let tag = TypeAssertion_1.asOrNull(obj, Tag_1.Tag);
          if (tag) {
            writer.WriteObjectStart();
            writer.WriteProperty("#", tag.text);
            writer.WriteObjectEnd();
            return;
          }
          let choice = TypeAssertion_1.asOrNull(obj, Choice_1.Choice);
          if (choice) {
            this.WriteChoice(writer, choice);
            return;
          }
          throw new Error("Failed to convert runtime object to Json token: " + obj);
        }
        static JObjectToDictionaryRuntimeObjs(jObject) {
          let dict = /* @__PURE__ */ new Map();
          for (let key in jObject) {
            if (jObject.hasOwnProperty(key)) {
              let inkObject = this.JTokenToRuntimeObject(jObject[key]);
              if (inkObject === null) {
                return NullException_1.throwNullException("inkObject");
              }
              dict.set(key, inkObject);
            }
          }
          return dict;
        }
        static JObjectToIntDictionary(jObject) {
          let dict = /* @__PURE__ */ new Map();
          for (let key in jObject) {
            if (jObject.hasOwnProperty(key)) {
              dict.set(key, parseInt(jObject[key]));
            }
          }
          return dict;
        }
        static JTokenToRuntimeObject(token) {
          if (typeof token === "number" && !isNaN(token) || typeof token === "boolean") {
            return Value_1.Value.Create(token);
          }
          if (typeof token === "string") {
            let str = token.toString();
            let firstChar = str[0];
            if (firstChar == "^")
              return new Value_1.StringValue(str.substring(1));
            else if (firstChar == "\n" && str.length == 1)
              return new Value_1.StringValue("\n");
            if (str == "<>")
              return new Glue_1.Glue();
            for (let i = 0; i < JsonSerialisation._controlCommandNames.length; ++i) {
              let cmdName = JsonSerialisation._controlCommandNames[i];
              if (str == cmdName) {
                return new ControlCommand_1.ControlCommand(i);
              }
            }
            if (str == "L^")
              str = "^";
            if (NativeFunctionCall_1.NativeFunctionCall.CallExistsWithName(str))
              return NativeFunctionCall_1.NativeFunctionCall.CallWithName(str);
            if (str == "->->")
              return ControlCommand_1.ControlCommand.PopTunnel();
            else if (str == "~ret")
              return ControlCommand_1.ControlCommand.PopFunction();
            if (str == "void")
              return new Void_1.Void();
          }
          if (typeof token === "object" && !Array.isArray(token)) {
            let obj = token;
            let propValue;
            if (obj["^->"]) {
              propValue = obj["^->"];
              return new Value_1.DivertTargetValue(new Path_1.Path(propValue.toString()));
            }
            if (obj["^var"]) {
              propValue = obj["^var"];
              let varPtr = new Value_1.VariablePointerValue(propValue.toString());
              if ("ci" in obj) {
                propValue = obj["ci"];
                varPtr.contextIndex = parseInt(propValue);
              }
              return varPtr;
            }
            let isDivert = false;
            let pushesToStack = false;
            let divPushType = PushPop_1.PushPopType.Function;
            let external = false;
            if (propValue = obj["->"]) {
              isDivert = true;
            } else if (propValue = obj["f()"]) {
              isDivert = true;
              pushesToStack = true;
              divPushType = PushPop_1.PushPopType.Function;
            } else if (propValue = obj["->t->"]) {
              isDivert = true;
              pushesToStack = true;
              divPushType = PushPop_1.PushPopType.Tunnel;
            } else if (propValue = obj["x()"]) {
              isDivert = true;
              external = true;
              pushesToStack = false;
              divPushType = PushPop_1.PushPopType.Function;
            }
            if (isDivert) {
              let divert = new Divert_1.Divert();
              divert.pushesToStack = pushesToStack;
              divert.stackPushType = divPushType;
              divert.isExternal = external;
              let target = propValue.toString();
              if (propValue = obj["var"])
                divert.variableDivertName = target;
              else
                divert.targetPathString = target;
              divert.isConditional = !!obj["c"];
              if (external) {
                if (propValue = obj["exArgs"])
                  divert.externalArgs = parseInt(propValue);
              }
              return divert;
            }
            if (propValue = obj["*"]) {
              let choice = new ChoicePoint_1.ChoicePoint();
              choice.pathStringOnChoice = propValue.toString();
              if (propValue = obj["flg"])
                choice.flags = parseInt(propValue);
              return choice;
            }
            if (propValue = obj["VAR?"]) {
              return new VariableReference_1.VariableReference(propValue.toString());
            } else if (propValue = obj["CNT?"]) {
              let readCountVarRef = new VariableReference_1.VariableReference();
              readCountVarRef.pathStringForCount = propValue.toString();
              return readCountVarRef;
            }
            let isVarAss = false;
            let isGlobalVar = false;
            if (propValue = obj["VAR="]) {
              isVarAss = true;
              isGlobalVar = true;
            } else if (propValue = obj["temp="]) {
              isVarAss = true;
              isGlobalVar = false;
            }
            if (isVarAss) {
              let varName = propValue.toString();
              let isNewDecl = !obj["re"];
              let varAss = new VariableAssignment_1.VariableAssignment(varName, isNewDecl);
              varAss.isGlobal = isGlobalVar;
              return varAss;
            }
            if (obj["#"] !== void 0) {
              propValue = obj["#"];
              return new Tag_1.Tag(propValue.toString());
            }
            if (propValue = obj["list"]) {
              let listContent = propValue;
              let rawList = new InkList_1.InkList();
              if (propValue = obj["origins"]) {
                let namesAsObjs = propValue;
                rawList.SetInitialOriginNames(namesAsObjs);
              }
              for (let key in listContent) {
                if (listContent.hasOwnProperty(key)) {
                  let nameToVal = listContent[key];
                  let item = new InkList_1.InkListItem(key);
                  let val = parseInt(nameToVal);
                  rawList.Add(item, val);
                }
              }
              return new Value_1.ListValue(rawList);
            }
            if (obj["originalChoicePath"] != null)
              return this.JObjectToChoice(obj);
          }
          if (Array.isArray(token)) {
            return this.JArrayToContainer(token);
          }
          if (token === null || token === void 0)
            return null;
          throw new Error("Failed to convert token to runtime object: " + this.toJson(token, ["parent"]));
        }
        static toJson(me, removes, space) {
          return JSON.stringify(me, (k, v) => (removes === null || removes === void 0 ? void 0 : removes.some((r) => r === k)) ? void 0 : v, space);
        }
        static WriteRuntimeContainer(writer, container, withoutName = false) {
          writer.WriteArrayStart();
          if (container === null) {
            return NullException_1.throwNullException("container");
          }
          for (let c of container.content)
            this.WriteRuntimeObject(writer, c);
          let namedOnlyContent = container.namedOnlyContent;
          let countFlags = container.countFlags;
          let hasNameProperty = container.name != null && !withoutName;
          let hasTerminator = namedOnlyContent != null || countFlags > 0 || hasNameProperty;
          if (hasTerminator) {
            writer.WriteObjectStart();
          }
          if (namedOnlyContent != null) {
            for (let [key, value] of namedOnlyContent) {
              let name = key;
              let namedContainer = TypeAssertion_1.asOrNull(value, Container_1.Container);
              writer.WritePropertyStart(name);
              this.WriteRuntimeContainer(writer, namedContainer, true);
              writer.WritePropertyEnd();
            }
          }
          if (countFlags > 0)
            writer.WriteIntProperty("#f", countFlags);
          if (hasNameProperty)
            writer.WriteProperty("#n", container.name);
          if (hasTerminator)
            writer.WriteObjectEnd();
          else
            writer.WriteNull();
          writer.WriteArrayEnd();
        }
        static JArrayToContainer(jArray) {
          let container = new Container_1.Container();
          container.content = this.JArrayToRuntimeObjList(jArray, true);
          let terminatingObj = jArray[jArray.length - 1];
          if (terminatingObj != null) {
            let namedOnlyContent = /* @__PURE__ */ new Map();
            for (let key in terminatingObj) {
              if (key == "#f") {
                container.countFlags = parseInt(terminatingObj[key]);
              } else if (key == "#n") {
                container.name = terminatingObj[key].toString();
              } else {
                let namedContentItem = this.JTokenToRuntimeObject(terminatingObj[key]);
                let namedSubContainer = TypeAssertion_1.asOrNull(namedContentItem, Container_1.Container);
                if (namedSubContainer)
                  namedSubContainer.name = key;
                namedOnlyContent.set(key, namedContentItem);
              }
            }
            container.namedOnlyContent = namedOnlyContent;
          }
          return container;
        }
        static JObjectToChoice(jObj) {
          let choice = new Choice_1.Choice();
          choice.text = jObj["text"].toString();
          choice.index = parseInt(jObj["index"]);
          choice.sourcePath = jObj["originalChoicePath"].toString();
          choice.originalThreadIndex = parseInt(jObj["originalThreadIndex"]);
          choice.pathStringOnChoice = jObj["targetPath"].toString();
          return choice;
        }
        static WriteChoice(writer, choice) {
          writer.WriteObjectStart();
          writer.WriteProperty("text", choice.text);
          writer.WriteIntProperty("index", choice.index);
          writer.WriteProperty("originalChoicePath", choice.sourcePath);
          writer.WriteIntProperty("originalThreadIndex", choice.originalThreadIndex);
          writer.WriteProperty("targetPath", choice.pathStringOnChoice);
          writer.WriteObjectEnd();
        }
        static WriteInkList(writer, listVal) {
          let rawList = listVal.value;
          if (rawList === null) {
            return NullException_1.throwNullException("rawList");
          }
          writer.WriteObjectStart();
          writer.WritePropertyStart("list");
          writer.WriteObjectStart();
          for (let [key, val] of rawList) {
            let item = InkList_1.InkListItem.fromSerializedKey(key);
            let itemVal = val;
            if (item.itemName === null) {
              return NullException_1.throwNullException("item.itemName");
            }
            writer.WritePropertyNameStart();
            writer.WritePropertyNameInner(item.originName ? item.originName : "?");
            writer.WritePropertyNameInner(".");
            writer.WritePropertyNameInner(item.itemName);
            writer.WritePropertyNameEnd();
            writer.Write(itemVal);
            writer.WritePropertyEnd();
          }
          writer.WriteObjectEnd();
          writer.WritePropertyEnd();
          if (rawList.Count == 0 && rawList.originNames != null && rawList.originNames.length > 0) {
            writer.WritePropertyStart("origins");
            writer.WriteArrayStart();
            for (let name of rawList.originNames)
              writer.Write(name);
            writer.WriteArrayEnd();
            writer.WritePropertyEnd();
          }
          writer.WriteObjectEnd();
        }
        static ListDefinitionsToJToken(origin) {
          let result = {};
          for (let def of origin.lists) {
            let listDefJson = {};
            for (let [key, val] of def.items) {
              let item = InkList_1.InkListItem.fromSerializedKey(key);
              if (item.itemName === null) {
                return NullException_1.throwNullException("item.itemName");
              }
              listDefJson[item.itemName] = val;
            }
            result[def.name] = listDefJson;
          }
          return result;
        }
        static JTokenToListDefinitions(obj) {
          let defsObj = obj;
          let allDefs = [];
          for (let key in defsObj) {
            if (defsObj.hasOwnProperty(key)) {
              let name = key.toString();
              let listDefJson = defsObj[key];
              let items = /* @__PURE__ */ new Map();
              for (let nameValueKey in listDefJson) {
                if (defsObj.hasOwnProperty(key)) {
                  let nameValue = listDefJson[nameValueKey];
                  items.set(nameValueKey, parseInt(nameValue));
                }
              }
              let def = new ListDefinition_1.ListDefinition(name, items);
              allDefs.push(def);
            }
          }
          return new ListDefinitionsOrigin_1.ListDefinitionsOrigin(allDefs);
        }
      };
      exports.JsonSerialisation = JsonSerialisation;
      JsonSerialisation._controlCommandNames = (() => {
        let _controlCommandNames = [];
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.EvalStart] = "ev";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.EvalOutput] = "out";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.EvalEnd] = "/ev";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.Duplicate] = "du";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.PopEvaluatedValue] = "pop";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.PopFunction] = "~ret";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.PopTunnel] = "->->";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.BeginString] = "str";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.EndString] = "/str";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.NoOp] = "nop";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.ChoiceCount] = "choiceCnt";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.Turns] = "turn";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.TurnsSince] = "turns";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.ReadCount] = "readc";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.Random] = "rnd";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.SeedRandom] = "srnd";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.VisitIndex] = "visit";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.SequenceShuffleIndex] = "seq";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.StartThread] = "thread";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.Done] = "done";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.End] = "end";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.ListFromInt] = "listInt";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.ListRange] = "range";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.ListRandom] = "lrnd";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.BeginTag] = "#";
        _controlCommandNames[ControlCommand_1.ControlCommand.CommandType.EndTag] = "/#";
        for (let i = 0; i < ControlCommand_1.ControlCommand.CommandType.TOTAL_VALUES; ++i) {
          if (_controlCommandNames[i] == null)
            throw new Error("Control command not accounted for in serialisation");
        }
        return _controlCommandNames;
      })();
    }
  });

  // node_modules/inkjs/engine/CallStack.js
  var require_CallStack = __commonJS({
    "node_modules/inkjs/engine/CallStack.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CallStack = void 0;
      var PushPop_1 = require_PushPop();
      var Path_1 = require_Path();
      var Story_1 = require_Story();
      var JsonSerialisation_1 = require_JsonSerialisation();
      var Value_1 = require_Value();
      var StringBuilder_1 = require_StringBuilder();
      var Pointer_1 = require_Pointer();
      var Debug_1 = require_Debug();
      var TryGetResult_1 = require_TryGetResult();
      var NullException_1 = require_NullException();
      var CallStack = class {
        constructor() {
          this._threadCounter = 0;
          this._startOfRoot = Pointer_1.Pointer.Null;
          if (arguments[0] instanceof Story_1.Story) {
            let storyContext = arguments[0];
            this._startOfRoot = Pointer_1.Pointer.StartOf(storyContext.rootContentContainer);
            this.Reset();
          } else {
            let toCopy = arguments[0];
            this._threads = [];
            for (let otherThread of toCopy._threads) {
              this._threads.push(otherThread.Copy());
            }
            this._threadCounter = toCopy._threadCounter;
            this._startOfRoot = toCopy._startOfRoot.copy();
          }
        }
        get elements() {
          return this.callStack;
        }
        get depth() {
          return this.elements.length;
        }
        get currentElement() {
          let thread = this._threads[this._threads.length - 1];
          let cs = thread.callstack;
          return cs[cs.length - 1];
        }
        get currentElementIndex() {
          return this.callStack.length - 1;
        }
        get currentThread() {
          return this._threads[this._threads.length - 1];
        }
        set currentThread(value) {
          Debug_1.Debug.Assert(this._threads.length == 1, "Shouldn't be directly setting the current thread when we have a stack of them");
          this._threads.length = 0;
          this._threads.push(value);
        }
        get canPop() {
          return this.callStack.length > 1;
        }
        Reset() {
          this._threads = [];
          this._threads.push(new CallStack.Thread());
          this._threads[0].callstack.push(new CallStack.Element(PushPop_1.PushPopType.Tunnel, this._startOfRoot));
        }
        SetJsonToken(jObject, storyContext) {
          this._threads.length = 0;
          let jThreads = jObject["threads"];
          for (let jThreadTok of jThreads) {
            let jThreadObj = jThreadTok;
            let thread = new CallStack.Thread(jThreadObj, storyContext);
            this._threads.push(thread);
          }
          this._threadCounter = parseInt(jObject["threadCounter"]);
          this._startOfRoot = Pointer_1.Pointer.StartOf(storyContext.rootContentContainer);
        }
        WriteJson(w) {
          w.WriteObject((writer) => {
            writer.WritePropertyStart("threads");
            writer.WriteArrayStart();
            for (let thread of this._threads) {
              thread.WriteJson(writer);
            }
            writer.WriteArrayEnd();
            writer.WritePropertyEnd();
            writer.WritePropertyStart("threadCounter");
            writer.WriteInt(this._threadCounter);
            writer.WritePropertyEnd();
          });
        }
        PushThread() {
          let newThread = this.currentThread.Copy();
          this._threadCounter++;
          newThread.threadIndex = this._threadCounter;
          this._threads.push(newThread);
        }
        ForkThread() {
          let forkedThread = this.currentThread.Copy();
          this._threadCounter++;
          forkedThread.threadIndex = this._threadCounter;
          return forkedThread;
        }
        PopThread() {
          if (this.canPopThread) {
            this._threads.splice(this._threads.indexOf(this.currentThread), 1);
          } else {
            throw new Error("Can't pop thread");
          }
        }
        get canPopThread() {
          return this._threads.length > 1 && !this.elementIsEvaluateFromGame;
        }
        get elementIsEvaluateFromGame() {
          return this.currentElement.type == PushPop_1.PushPopType.FunctionEvaluationFromGame;
        }
        Push(type, externalEvaluationStackHeight = 0, outputStreamLengthWithPushed = 0) {
          let element = new CallStack.Element(type, this.currentElement.currentPointer, false);
          element.evaluationStackHeightWhenPushed = externalEvaluationStackHeight;
          element.functionStartInOutputStream = outputStreamLengthWithPushed;
          this.callStack.push(element);
        }
        CanPop(type = null) {
          if (!this.canPop)
            return false;
          if (type == null)
            return true;
          return this.currentElement.type == type;
        }
        Pop(type = null) {
          if (this.CanPop(type)) {
            this.callStack.pop();
            return;
          } else {
            throw new Error("Mismatched push/pop in Callstack");
          }
        }
        GetTemporaryVariableWithName(name, contextIndex = -1) {
          if (contextIndex == -1)
            contextIndex = this.currentElementIndex + 1;
          let contextElement = this.callStack[contextIndex - 1];
          let varValue = TryGetResult_1.tryGetValueFromMap(contextElement.temporaryVariables, name, null);
          if (varValue.exists) {
            return varValue.result;
          } else {
            return null;
          }
        }
        SetTemporaryVariable(name, value, declareNew, contextIndex = -1) {
          if (contextIndex == -1)
            contextIndex = this.currentElementIndex + 1;
          let contextElement = this.callStack[contextIndex - 1];
          if (!declareNew && !contextElement.temporaryVariables.get(name)) {
            throw new Error("Could not find temporary variable to set: " + name);
          }
          let oldValue = TryGetResult_1.tryGetValueFromMap(contextElement.temporaryVariables, name, null);
          if (oldValue.exists)
            Value_1.ListValue.RetainListOriginsForAssignment(oldValue.result, value);
          contextElement.temporaryVariables.set(name, value);
        }
        ContextForVariableNamed(name) {
          if (this.currentElement.temporaryVariables.get(name)) {
            return this.currentElementIndex + 1;
          } else {
            return 0;
          }
        }
        ThreadWithIndex(index) {
          let filtered = this._threads.filter((t) => {
            if (t.threadIndex == index)
              return t;
          });
          return filtered.length > 0 ? filtered[0] : null;
        }
        get callStack() {
          return this.currentThread.callstack;
        }
        get callStackTrace() {
          let sb = new StringBuilder_1.StringBuilder();
          for (let t = 0; t < this._threads.length; t++) {
            let thread = this._threads[t];
            let isCurrent = t == this._threads.length - 1;
            sb.AppendFormat("=== THREAD {0}/{1} {2}===\n", t + 1, this._threads.length, isCurrent ? "(current) " : "");
            for (let i = 0; i < thread.callstack.length; i++) {
              if (thread.callstack[i].type == PushPop_1.PushPopType.Function)
                sb.Append("  [FUNCTION] ");
              else
                sb.Append("  [TUNNEL] ");
              let pointer = thread.callstack[i].currentPointer;
              if (!pointer.isNull) {
                sb.Append("<SOMEWHERE IN ");
                if (pointer.container === null) {
                  return NullException_1.throwNullException("pointer.container");
                }
                sb.Append(pointer.container.path.toString());
                sb.AppendLine(">");
              }
            }
          }
          return sb.toString();
        }
      };
      exports.CallStack = CallStack;
      (function(CallStack2) {
        class Element {
          constructor(type, pointer, inExpressionEvaluation = false) {
            this.evaluationStackHeightWhenPushed = 0;
            this.functionStartInOutputStream = 0;
            this.currentPointer = pointer.copy();
            this.inExpressionEvaluation = inExpressionEvaluation;
            this.temporaryVariables = /* @__PURE__ */ new Map();
            this.type = type;
          }
          Copy() {
            let copy = new Element(this.type, this.currentPointer, this.inExpressionEvaluation);
            copy.temporaryVariables = new Map(this.temporaryVariables);
            copy.evaluationStackHeightWhenPushed = this.evaluationStackHeightWhenPushed;
            copy.functionStartInOutputStream = this.functionStartInOutputStream;
            return copy;
          }
        }
        CallStack2.Element = Element;
        class Thread {
          constructor() {
            this.threadIndex = 0;
            this.previousPointer = Pointer_1.Pointer.Null;
            this.callstack = [];
            if (arguments[0] && arguments[1]) {
              let jThreadObj = arguments[0];
              let storyContext = arguments[1];
              this.threadIndex = parseInt(jThreadObj["threadIndex"]);
              let jThreadCallstack = jThreadObj["callstack"];
              for (let jElTok of jThreadCallstack) {
                let jElementObj = jElTok;
                let pushPopType = parseInt(jElementObj["type"]);
                let pointer = Pointer_1.Pointer.Null;
                let currentContainerPathStr;
                let currentContainerPathStrToken = jElementObj["cPath"];
                if (typeof currentContainerPathStrToken !== "undefined") {
                  currentContainerPathStr = currentContainerPathStrToken.toString();
                  let threadPointerResult = storyContext.ContentAtPath(new Path_1.Path(currentContainerPathStr));
                  pointer.container = threadPointerResult.container;
                  pointer.index = parseInt(jElementObj["idx"]);
                  if (threadPointerResult.obj == null)
                    throw new Error("When loading state, internal story location couldn't be found: " + currentContainerPathStr + ". Has the story changed since this save data was created?");
                  else if (threadPointerResult.approximate) {
                    if (pointer.container === null) {
                      return NullException_1.throwNullException("pointer.container");
                    }
                    storyContext.Warning("When loading state, exact internal story location couldn't be found: '" + currentContainerPathStr + "', so it was approximated to '" + pointer.container.path.toString() + "' to recover. Has the story changed since this save data was created?");
                  }
                }
                let inExpressionEvaluation = !!jElementObj["exp"];
                let el = new Element(pushPopType, pointer, inExpressionEvaluation);
                let temps = jElementObj["temp"];
                if (typeof temps !== "undefined") {
                  el.temporaryVariables = JsonSerialisation_1.JsonSerialisation.JObjectToDictionaryRuntimeObjs(temps);
                } else {
                  el.temporaryVariables.clear();
                }
                this.callstack.push(el);
              }
              let prevContentObjPath = jThreadObj["previousContentObject"];
              if (typeof prevContentObjPath !== "undefined") {
                let prevPath = new Path_1.Path(prevContentObjPath.toString());
                this.previousPointer = storyContext.PointerAtPath(prevPath);
              }
            }
          }
          Copy() {
            let copy = new Thread();
            copy.threadIndex = this.threadIndex;
            for (let e of this.callstack) {
              copy.callstack.push(e.Copy());
            }
            copy.previousPointer = this.previousPointer.copy();
            return copy;
          }
          WriteJson(writer) {
            writer.WriteObjectStart();
            writer.WritePropertyStart("callstack");
            writer.WriteArrayStart();
            for (let el of this.callstack) {
              writer.WriteObjectStart();
              if (!el.currentPointer.isNull) {
                if (el.currentPointer.container === null) {
                  return NullException_1.throwNullException("el.currentPointer.container");
                }
                writer.WriteProperty("cPath", el.currentPointer.container.path.componentsString);
                writer.WriteIntProperty("idx", el.currentPointer.index);
              }
              writer.WriteProperty("exp", el.inExpressionEvaluation);
              writer.WriteIntProperty("type", el.type);
              if (el.temporaryVariables.size > 0) {
                writer.WritePropertyStart("temp");
                JsonSerialisation_1.JsonSerialisation.WriteDictionaryRuntimeObjs(writer, el.temporaryVariables);
                writer.WritePropertyEnd();
              }
              writer.WriteObjectEnd();
            }
            writer.WriteArrayEnd();
            writer.WritePropertyEnd();
            writer.WriteIntProperty("threadIndex", this.threadIndex);
            if (!this.previousPointer.isNull) {
              let resolvedPointer = this.previousPointer.Resolve();
              if (resolvedPointer === null) {
                return NullException_1.throwNullException("this.previousPointer.Resolve()");
              }
              writer.WriteProperty("previousContentObject", resolvedPointer.path.toString());
            }
            writer.WriteObjectEnd();
          }
        }
        CallStack2.Thread = Thread;
      })(CallStack = exports.CallStack || (exports.CallStack = {}));
    }
  });

  // node_modules/inkjs/engine/VariablesState.js
  var require_VariablesState = __commonJS({
    "node_modules/inkjs/engine/VariablesState.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.VariablesState = void 0;
      var Value_1 = require_Value();
      var StoryException_1 = require_StoryException();
      var JsonSerialisation_1 = require_JsonSerialisation();
      var TypeAssertion_1 = require_TypeAssertion();
      var TryGetResult_1 = require_TryGetResult();
      var NullException_1 = require_NullException();
      function VariablesStateAccessor() {
        return class {
        };
      }
      var VariablesState = class extends VariablesStateAccessor() {
        constructor(callStack, listDefsOrigin) {
          super();
          this.variableChangedEventCallbacks = [];
          this.patch = null;
          this._batchObservingVariableChanges = false;
          this._defaultGlobalVariables = /* @__PURE__ */ new Map();
          this._changedVariablesForBatchObs = /* @__PURE__ */ new Set();
          this._globalVariables = /* @__PURE__ */ new Map();
          this._callStack = callStack;
          this._listDefsOrigin = listDefsOrigin;
          try {
            let p = new Proxy(this, {
              get(target, name) {
                return name in target ? target[name] : target.$(name);
              },
              set(target, name, value) {
                if (name in target)
                  target[name] = value;
                else
                  target.$(name, value);
                return true;
              }
            });
            return p;
          } catch (e) {
          }
        }
        variableChangedEvent(variableName, newValue) {
          for (let callback of this.variableChangedEventCallbacks) {
            callback(variableName, newValue);
          }
        }
        get batchObservingVariableChanges() {
          return this._batchObservingVariableChanges;
        }
        set batchObservingVariableChanges(value) {
          this._batchObservingVariableChanges = value;
          if (value) {
            this._changedVariablesForBatchObs = /* @__PURE__ */ new Set();
          } else {
            if (this._changedVariablesForBatchObs != null) {
              for (let variableName of this._changedVariablesForBatchObs) {
                let currentValue = this._globalVariables.get(variableName);
                if (!currentValue) {
                  NullException_1.throwNullException("currentValue");
                } else {
                  this.variableChangedEvent(variableName, currentValue);
                }
              }
              this._changedVariablesForBatchObs = null;
            }
          }
        }
        get callStack() {
          return this._callStack;
        }
        set callStack(callStack) {
          this._callStack = callStack;
        }
        $(variableName, value) {
          if (typeof value === "undefined") {
            let varContents = null;
            if (this.patch !== null) {
              varContents = this.patch.TryGetGlobal(variableName, null);
              if (varContents.exists)
                return varContents.result.valueObject;
            }
            varContents = this._globalVariables.get(variableName);
            if (typeof varContents === "undefined") {
              varContents = this._defaultGlobalVariables.get(variableName);
            }
            if (typeof varContents !== "undefined")
              return varContents.valueObject;
            else
              return null;
          } else {
            if (typeof this._defaultGlobalVariables.get(variableName) === "undefined")
              throw new StoryException_1.StoryException("Cannot assign to a variable (" + variableName + ") that hasn't been declared in the story");
            let val = Value_1.Value.Create(value);
            if (val == null) {
              if (value == null) {
                throw new Error("Cannot pass null to VariableState");
              } else {
                throw new Error("Invalid value passed to VariableState: " + value.toString());
              }
            }
            this.SetGlobal(variableName, val);
          }
        }
        ApplyPatch() {
          if (this.patch === null) {
            return NullException_1.throwNullException("this.patch");
          }
          for (let [namedVarKey, namedVarValue] of this.patch.globals) {
            this._globalVariables.set(namedVarKey, namedVarValue);
          }
          if (this._changedVariablesForBatchObs !== null) {
            for (let name of this.patch.changedVariables) {
              this._changedVariablesForBatchObs.add(name);
            }
          }
          this.patch = null;
        }
        SetJsonToken(jToken) {
          this._globalVariables.clear();
          for (let [varValKey, varValValue] of this._defaultGlobalVariables) {
            let loadedToken = jToken[varValKey];
            if (typeof loadedToken !== "undefined") {
              let tokenInkObject = JsonSerialisation_1.JsonSerialisation.JTokenToRuntimeObject(loadedToken);
              if (tokenInkObject === null) {
                return NullException_1.throwNullException("tokenInkObject");
              }
              this._globalVariables.set(varValKey, tokenInkObject);
            } else {
              this._globalVariables.set(varValKey, varValValue);
            }
          }
        }
        WriteJson(writer) {
          writer.WriteObjectStart();
          for (let [keyValKey, keyValValue] of this._globalVariables) {
            let name = keyValKey;
            let val = keyValValue;
            if (VariablesState.dontSaveDefaultValues) {
              if (this._defaultGlobalVariables.has(name)) {
                let defaultVal = this._defaultGlobalVariables.get(name);
                if (this.RuntimeObjectsEqual(val, defaultVal))
                  continue;
              }
            }
            writer.WritePropertyStart(name);
            JsonSerialisation_1.JsonSerialisation.WriteRuntimeObject(writer, val);
            writer.WritePropertyEnd();
          }
          writer.WriteObjectEnd();
        }
        RuntimeObjectsEqual(obj1, obj2) {
          if (obj1 === null) {
            return NullException_1.throwNullException("obj1");
          }
          if (obj2 === null) {
            return NullException_1.throwNullException("obj2");
          }
          if (obj1.constructor !== obj2.constructor)
            return false;
          let boolVal = TypeAssertion_1.asOrNull(obj1, Value_1.BoolValue);
          if (boolVal !== null) {
            return boolVal.value === TypeAssertion_1.asOrThrows(obj2, Value_1.BoolValue).value;
          }
          let intVal = TypeAssertion_1.asOrNull(obj1, Value_1.IntValue);
          if (intVal !== null) {
            return intVal.value === TypeAssertion_1.asOrThrows(obj2, Value_1.IntValue).value;
          }
          let floatVal = TypeAssertion_1.asOrNull(obj1, Value_1.FloatValue);
          if (floatVal !== null) {
            return floatVal.value === TypeAssertion_1.asOrThrows(obj2, Value_1.FloatValue).value;
          }
          let val1 = TypeAssertion_1.asOrNull(obj1, Value_1.Value);
          let val2 = TypeAssertion_1.asOrNull(obj2, Value_1.Value);
          if (val1 !== null && val2 !== null) {
            if (TypeAssertion_1.isEquatable(val1.valueObject) && TypeAssertion_1.isEquatable(val2.valueObject)) {
              return val1.valueObject.Equals(val2.valueObject);
            } else {
              return val1.valueObject === val2.valueObject;
            }
          }
          throw new Error("FastRoughDefinitelyEquals: Unsupported runtime object type: " + obj1.constructor.name);
        }
        GetVariableWithName(name, contextIndex = -1) {
          let varValue = this.GetRawVariableWithName(name, contextIndex);
          let varPointer = TypeAssertion_1.asOrNull(varValue, Value_1.VariablePointerValue);
          if (varPointer !== null) {
            varValue = this.ValueAtVariablePointer(varPointer);
          }
          return varValue;
        }
        TryGetDefaultVariableValue(name) {
          let val = TryGetResult_1.tryGetValueFromMap(this._defaultGlobalVariables, name, null);
          return val.exists ? val.result : null;
        }
        GlobalVariableExistsWithName(name) {
          return this._globalVariables.has(name) || this._defaultGlobalVariables !== null && this._defaultGlobalVariables.has(name);
        }
        GetRawVariableWithName(name, contextIndex) {
          let varValue = null;
          if (contextIndex == 0 || contextIndex == -1) {
            let variableValue = null;
            if (this.patch !== null) {
              variableValue = this.patch.TryGetGlobal(name, null);
              if (variableValue.exists)
                return variableValue.result;
            }
            variableValue = TryGetResult_1.tryGetValueFromMap(this._globalVariables, name, null);
            if (variableValue.exists)
              return variableValue.result;
            if (this._defaultGlobalVariables !== null) {
              variableValue = TryGetResult_1.tryGetValueFromMap(this._defaultGlobalVariables, name, null);
              if (variableValue.exists)
                return variableValue.result;
            }
            if (this._listDefsOrigin === null)
              return NullException_1.throwNullException("VariablesState._listDefsOrigin");
            let listItemValue = this._listDefsOrigin.FindSingleItemListWithName(name);
            if (listItemValue)
              return listItemValue;
          }
          varValue = this._callStack.GetTemporaryVariableWithName(name, contextIndex);
          return varValue;
        }
        ValueAtVariablePointer(pointer) {
          return this.GetVariableWithName(pointer.variableName, pointer.contextIndex);
        }
        Assign(varAss, value) {
          let name = varAss.variableName;
          if (name === null) {
            return NullException_1.throwNullException("name");
          }
          let contextIndex = -1;
          let setGlobal = false;
          if (varAss.isNewDeclaration) {
            setGlobal = varAss.isGlobal;
          } else {
            setGlobal = this.GlobalVariableExistsWithName(name);
          }
          if (varAss.isNewDeclaration) {
            let varPointer = TypeAssertion_1.asOrNull(value, Value_1.VariablePointerValue);
            if (varPointer !== null) {
              let fullyResolvedVariablePointer = this.ResolveVariablePointer(varPointer);
              value = fullyResolvedVariablePointer;
            }
          } else {
            let existingPointer = null;
            do {
              existingPointer = TypeAssertion_1.asOrNull(this.GetRawVariableWithName(name, contextIndex), Value_1.VariablePointerValue);
              if (existingPointer != null) {
                name = existingPointer.variableName;
                contextIndex = existingPointer.contextIndex;
                setGlobal = contextIndex == 0;
              }
            } while (existingPointer != null);
          }
          if (setGlobal) {
            this.SetGlobal(name, value);
          } else {
            this._callStack.SetTemporaryVariable(name, value, varAss.isNewDeclaration, contextIndex);
          }
        }
        SnapshotDefaultGlobals() {
          this._defaultGlobalVariables = new Map(this._globalVariables);
        }
        RetainListOriginsForAssignment(oldValue, newValue) {
          let oldList = TypeAssertion_1.asOrThrows(oldValue, Value_1.ListValue);
          let newList = TypeAssertion_1.asOrThrows(newValue, Value_1.ListValue);
          if (oldList.value && newList.value && newList.value.Count == 0) {
            newList.value.SetInitialOriginNames(oldList.value.originNames);
          }
        }
        SetGlobal(variableName, value) {
          let oldValue = null;
          if (this.patch === null) {
            oldValue = TryGetResult_1.tryGetValueFromMap(this._globalVariables, variableName, null);
          }
          if (this.patch !== null) {
            oldValue = this.patch.TryGetGlobal(variableName, null);
            if (!oldValue.exists) {
              oldValue = TryGetResult_1.tryGetValueFromMap(this._globalVariables, variableName, null);
            }
          }
          Value_1.ListValue.RetainListOriginsForAssignment(oldValue.result, value);
          if (variableName === null) {
            return NullException_1.throwNullException("variableName");
          }
          if (this.patch !== null) {
            this.patch.SetGlobal(variableName, value);
          } else {
            this._globalVariables.set(variableName, value);
          }
          if (this.variableChangedEvent !== null && oldValue !== null && value !== oldValue.result) {
            if (this.batchObservingVariableChanges) {
              if (this._changedVariablesForBatchObs === null) {
                return NullException_1.throwNullException("this._changedVariablesForBatchObs");
              }
              if (this.patch !== null) {
                this.patch.AddChangedVariable(variableName);
              } else if (this._changedVariablesForBatchObs !== null) {
                this._changedVariablesForBatchObs.add(variableName);
              }
            } else {
              this.variableChangedEvent(variableName, value);
            }
          }
        }
        ResolveVariablePointer(varPointer) {
          let contextIndex = varPointer.contextIndex;
          if (contextIndex == -1)
            contextIndex = this.GetContextIndexOfVariableNamed(varPointer.variableName);
          let valueOfVariablePointedTo = this.GetRawVariableWithName(varPointer.variableName, contextIndex);
          let doubleRedirectionPointer = TypeAssertion_1.asOrNull(valueOfVariablePointedTo, Value_1.VariablePointerValue);
          if (doubleRedirectionPointer != null) {
            return doubleRedirectionPointer;
          } else {
            return new Value_1.VariablePointerValue(varPointer.variableName, contextIndex);
          }
        }
        GetContextIndexOfVariableNamed(varName) {
          if (this.GlobalVariableExistsWithName(varName))
            return 0;
          return this._callStack.currentElementIndex;
        }
        /**
         * This function is specific to the js version of ink. It allows to register a
         * callback that will be called when a variable changes. The original code uses
         * `state.variableChangedEvent += callback` instead.
         *
         * @param {function} callback
         */
        ObserveVariableChange(callback) {
          this.variableChangedEventCallbacks.push(callback);
        }
      };
      exports.VariablesState = VariablesState;
      VariablesState.dontSaveDefaultValues = true;
    }
  });

  // node_modules/inkjs/engine/PRNG.js
  var require_PRNG = __commonJS({
    "node_modules/inkjs/engine/PRNG.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PRNG = void 0;
      var PRNG = class {
        constructor(seed) {
          this.seed = seed % 2147483647;
          if (this.seed <= 0)
            this.seed += 2147483646;
        }
        next() {
          return this.seed = this.seed * 48271 % 2147483647;
        }
        nextFloat() {
          return (this.next() - 1) / 2147483646;
        }
      };
      exports.PRNG = PRNG;
    }
  });

  // node_modules/inkjs/engine/StatePatch.js
  var require_StatePatch = __commonJS({
    "node_modules/inkjs/engine/StatePatch.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StatePatch = void 0;
      var StatePatch = class {
        constructor() {
          this._changedVariables = /* @__PURE__ */ new Set();
          this._visitCounts = /* @__PURE__ */ new Map();
          this._turnIndices = /* @__PURE__ */ new Map();
          if (arguments.length === 1 && arguments[0] !== null) {
            let toCopy = arguments[0];
            this._globals = new Map(toCopy._globals);
            this._changedVariables = new Set(toCopy._changedVariables);
            this._visitCounts = new Map(toCopy._visitCounts);
            this._turnIndices = new Map(toCopy._turnIndices);
          } else {
            this._globals = /* @__PURE__ */ new Map();
            this._changedVariables = /* @__PURE__ */ new Set();
            this._visitCounts = /* @__PURE__ */ new Map();
            this._turnIndices = /* @__PURE__ */ new Map();
          }
        }
        get globals() {
          return this._globals;
        }
        get changedVariables() {
          return this._changedVariables;
        }
        get visitCounts() {
          return this._visitCounts;
        }
        get turnIndices() {
          return this._turnIndices;
        }
        TryGetGlobal(name, value) {
          if (name !== null && this._globals.has(name)) {
            return { result: this._globals.get(name), exists: true };
          }
          return { result: value, exists: false };
        }
        SetGlobal(name, value) {
          this._globals.set(name, value);
        }
        AddChangedVariable(name) {
          return this._changedVariables.add(name);
        }
        TryGetVisitCount(container, count) {
          if (this._visitCounts.has(container)) {
            return { result: this._visitCounts.get(container), exists: true };
          }
          return { result: count, exists: false };
        }
        SetVisitCount(container, count) {
          this._visitCounts.set(container, count);
        }
        SetTurnIndex(container, index) {
          this._turnIndices.set(container, index);
        }
        TryGetTurnIndex(container, index) {
          if (this._turnIndices.has(container)) {
            return { result: this._turnIndices.get(container), exists: true };
          }
          return { result: index, exists: false };
        }
      };
      exports.StatePatch = StatePatch;
    }
  });

  // node_modules/inkjs/engine/SimpleJson.js
  var require_SimpleJson = __commonJS({
    "node_modules/inkjs/engine/SimpleJson.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SimpleJson = void 0;
      var SimpleJson = class {
        static TextToDictionary(text) {
          return new SimpleJson.Reader(text).ToDictionary();
        }
        static TextToArray(text) {
          return new SimpleJson.Reader(text).ToArray();
        }
      };
      exports.SimpleJson = SimpleJson;
      (function(SimpleJson2) {
        class Reader {
          constructor(text) {
            this._rootObject = JSON.parse(text);
          }
          ToDictionary() {
            return this._rootObject;
          }
          ToArray() {
            return this._rootObject;
          }
        }
        SimpleJson2.Reader = Reader;
        class Writer {
          constructor() {
            this._currentPropertyName = null;
            this._currentString = null;
            this._stateStack = [];
            this._collectionStack = [];
            this._propertyNameStack = [];
            this._jsonObject = null;
          }
          WriteObject(inner) {
            this.WriteObjectStart();
            inner(this);
            this.WriteObjectEnd();
          }
          // Add a new object.
          WriteObjectStart() {
            this.StartNewObject(true);
            let newObject = {};
            if (this.state === SimpleJson2.Writer.State.Property) {
              this.Assert(this.currentCollection !== null);
              this.Assert(this.currentPropertyName !== null);
              let propertyName = this._propertyNameStack.pop();
              this.currentCollection[propertyName] = newObject;
              this._collectionStack.push(newObject);
            } else if (this.state === SimpleJson2.Writer.State.Array) {
              this.Assert(this.currentCollection !== null);
              this.currentCollection.push(newObject);
              this._collectionStack.push(newObject);
            } else {
              this.Assert(this.state === SimpleJson2.Writer.State.None);
              this._jsonObject = newObject;
              this._collectionStack.push(newObject);
            }
            this._stateStack.push(new SimpleJson2.Writer.StateElement(SimpleJson2.Writer.State.Object));
          }
          WriteObjectEnd() {
            this.Assert(this.state === SimpleJson2.Writer.State.Object);
            this._collectionStack.pop();
            this._stateStack.pop();
          }
          // Write a property name / value pair to the current object.
          WriteProperty(name, innerOrContent) {
            this.WritePropertyStart(name);
            if (arguments[1] instanceof Function) {
              let inner = arguments[1];
              inner(this);
            } else {
              let content = arguments[1];
              this.Write(content);
            }
            this.WritePropertyEnd();
          }
          // Int and Float are separate calls, since there both are
          // numbers in JavaScript, but need to be handled differently.
          WriteIntProperty(name, content) {
            this.WritePropertyStart(name);
            this.WriteInt(content);
            this.WritePropertyEnd();
          }
          WriteFloatProperty(name, content) {
            this.WritePropertyStart(name);
            this.WriteFloat(content);
            this.WritePropertyEnd();
          }
          // Prepare a new property name, which will be use to add the
          // new object when calling _addToCurrentObject() from a Write
          // method.
          WritePropertyStart(name) {
            this.Assert(this.state === SimpleJson2.Writer.State.Object);
            this._propertyNameStack.push(name);
            this.IncrementChildCount();
            this._stateStack.push(new SimpleJson2.Writer.StateElement(SimpleJson2.Writer.State.Property));
          }
          WritePropertyEnd() {
            this.Assert(this.state === SimpleJson2.Writer.State.Property);
            this.Assert(this.childCount === 1);
            this._stateStack.pop();
          }
          // Prepare a new property name, except this time, the property name
          // will be created by concatenating all the strings passed to
          // WritePropertyNameInner.
          WritePropertyNameStart() {
            this.Assert(this.state === SimpleJson2.Writer.State.Object);
            this.IncrementChildCount();
            this._currentPropertyName = "";
            this._stateStack.push(new SimpleJson2.Writer.StateElement(SimpleJson2.Writer.State.Property));
            this._stateStack.push(new SimpleJson2.Writer.StateElement(SimpleJson2.Writer.State.PropertyName));
          }
          WritePropertyNameEnd() {
            this.Assert(this.state === SimpleJson2.Writer.State.PropertyName);
            this.Assert(this._currentPropertyName !== null);
            this._propertyNameStack.push(this._currentPropertyName);
            this._currentPropertyName = null;
            this._stateStack.pop();
          }
          WritePropertyNameInner(str) {
            this.Assert(this.state === SimpleJson2.Writer.State.PropertyName);
            this.Assert(this._currentPropertyName !== null);
            this._currentPropertyName += str;
          }
          // Add a new array.
          WriteArrayStart() {
            this.StartNewObject(true);
            let newObject = [];
            if (this.state === SimpleJson2.Writer.State.Property) {
              this.Assert(this.currentCollection !== null);
              this.Assert(this.currentPropertyName !== null);
              let propertyName = this._propertyNameStack.pop();
              this.currentCollection[propertyName] = newObject;
              this._collectionStack.push(newObject);
            } else if (this.state === SimpleJson2.Writer.State.Array) {
              this.Assert(this.currentCollection !== null);
              this.currentCollection.push(newObject);
              this._collectionStack.push(newObject);
            } else {
              this.Assert(this.state === SimpleJson2.Writer.State.None);
              this._jsonObject = newObject;
              this._collectionStack.push(newObject);
            }
            this._stateStack.push(new SimpleJson2.Writer.StateElement(SimpleJson2.Writer.State.Array));
          }
          WriteArrayEnd() {
            this.Assert(this.state === SimpleJson2.Writer.State.Array);
            this._collectionStack.pop();
            this._stateStack.pop();
          }
          // Add the value to the appropriate collection (array / object), given the current
          // context.
          Write(value, escape = true) {
            if (value === null) {
              console.error("Warning: trying to write a null value");
              return;
            }
            this.StartNewObject(false);
            this._addToCurrentObject(value);
          }
          WriteBool(value) {
            if (value === null) {
              return;
            }
            this.StartNewObject(false);
            this._addToCurrentObject(value);
          }
          WriteInt(value) {
            if (value === null) {
              return;
            }
            this.StartNewObject(false);
            this._addToCurrentObject(Math.floor(value));
          }
          // Since JSON doesn't support NaN and Infinity, these values
          // are converted here.
          WriteFloat(value) {
            if (value === null) {
              return;
            }
            this.StartNewObject(false);
            if (value == Number.POSITIVE_INFINITY) {
              this._addToCurrentObject(34e37);
            } else if (value == Number.NEGATIVE_INFINITY) {
              this._addToCurrentObject(-34e37);
            } else if (isNaN(value)) {
              this._addToCurrentObject(0);
            } else {
              this._addToCurrentObject(value);
            }
          }
          WriteNull() {
            this.StartNewObject(false);
            this._addToCurrentObject(null);
          }
          // Prepare a string before adding it to the current collection in
          // WriteStringEnd(). The string will be a concatenation of all the
          // strings passed to WriteStringInner.
          WriteStringStart() {
            this.StartNewObject(false);
            this._currentString = "";
            this._stateStack.push(new SimpleJson2.Writer.StateElement(SimpleJson2.Writer.State.String));
          }
          WriteStringEnd() {
            this.Assert(this.state == SimpleJson2.Writer.State.String);
            this._stateStack.pop();
            this._addToCurrentObject(this._currentString);
            this._currentString = null;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          WriteStringInner(str, escape = true) {
            this.Assert(this.state === SimpleJson2.Writer.State.String);
            if (str === null) {
              console.error("Warning: trying to write a null string");
              return;
            }
            this._currentString += str;
          }
          // Serialise the root object into a JSON string.
          toString() {
            if (this._jsonObject === null) {
              return "";
            }
            return JSON.stringify(this._jsonObject);
          }
          // Prepare the state stack when adding new objects / values.
          StartNewObject(container) {
            if (container) {
              this.Assert(this.state === SimpleJson2.Writer.State.None || this.state === SimpleJson2.Writer.State.Property || this.state === SimpleJson2.Writer.State.Array);
            } else {
              this.Assert(this.state === SimpleJson2.Writer.State.Property || this.state === SimpleJson2.Writer.State.Array);
            }
            if (this.state === SimpleJson2.Writer.State.Property) {
              this.Assert(this.childCount === 0);
            }
            if (this.state === SimpleJson2.Writer.State.Array || this.state === SimpleJson2.Writer.State.Property) {
              this.IncrementChildCount();
            }
          }
          // These getters peek all the different stacks.
          get state() {
            if (this._stateStack.length > 0) {
              return this._stateStack[this._stateStack.length - 1].type;
            } else {
              return SimpleJson2.Writer.State.None;
            }
          }
          get childCount() {
            if (this._stateStack.length > 0) {
              return this._stateStack[this._stateStack.length - 1].childCount;
            } else {
              return 0;
            }
          }
          get currentCollection() {
            if (this._collectionStack.length > 0) {
              return this._collectionStack[this._collectionStack.length - 1];
            } else {
              return null;
            }
          }
          get currentPropertyName() {
            if (this._propertyNameStack.length > 0) {
              return this._propertyNameStack[this._propertyNameStack.length - 1];
            } else {
              return null;
            }
          }
          IncrementChildCount() {
            this.Assert(this._stateStack.length > 0);
            let currEl = this._stateStack.pop();
            currEl.childCount++;
            this._stateStack.push(currEl);
          }
          Assert(condition) {
            if (!condition)
              throw Error("Assert failed while writing JSON");
          }
          // This method did not exist in the original C# code. It adds
          // the given value to the current collection (used by Write methods).
          _addToCurrentObject(value) {
            this.Assert(this.currentCollection !== null);
            if (this.state === SimpleJson2.Writer.State.Array) {
              this.Assert(Array.isArray(this.currentCollection));
              this.currentCollection.push(value);
            } else if (this.state === SimpleJson2.Writer.State.Property) {
              this.Assert(!Array.isArray(this.currentCollection));
              this.Assert(this.currentPropertyName !== null);
              this.currentCollection[this.currentPropertyName] = value;
              this._propertyNameStack.pop();
            }
          }
        }
        SimpleJson2.Writer = Writer;
        (function(Writer2) {
          let State;
          (function(State2) {
            State2[State2["None"] = 0] = "None";
            State2[State2["Object"] = 1] = "Object";
            State2[State2["Array"] = 2] = "Array";
            State2[State2["Property"] = 3] = "Property";
            State2[State2["PropertyName"] = 4] = "PropertyName";
            State2[State2["String"] = 5] = "String";
          })(State = Writer2.State || (Writer2.State = {}));
          class StateElement {
            constructor(type) {
              this.type = SimpleJson2.Writer.State.None;
              this.childCount = 0;
              this.type = type;
            }
          }
          Writer2.StateElement = StateElement;
        })(Writer = SimpleJson2.Writer || (SimpleJson2.Writer = {}));
      })(SimpleJson = exports.SimpleJson || (exports.SimpleJson = {}));
    }
  });

  // node_modules/inkjs/engine/Flow.js
  var require_Flow = __commonJS({
    "node_modules/inkjs/engine/Flow.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Flow = void 0;
      var CallStack_1 = require_CallStack();
      var JsonSerialisation_1 = require_JsonSerialisation();
      var NullException_1 = require_NullException();
      var Flow = class {
        constructor() {
          let name = arguments[0];
          let story = arguments[1];
          this.name = name;
          this.callStack = new CallStack_1.CallStack(story);
          if (arguments[2]) {
            let jObject = arguments[2];
            this.callStack.SetJsonToken(jObject["callstack"], story);
            this.outputStream = JsonSerialisation_1.JsonSerialisation.JArrayToRuntimeObjList(jObject["outputStream"]);
            this.currentChoices = JsonSerialisation_1.JsonSerialisation.JArrayToRuntimeObjList(jObject["currentChoices"]);
            let jChoiceThreadsObj = jObject["choiceThreads"];
            if (typeof jChoiceThreadsObj !== "undefined") {
              this.LoadFlowChoiceThreads(jChoiceThreadsObj, story);
            }
          } else {
            this.outputStream = [];
            this.currentChoices = [];
          }
        }
        WriteJson(writer) {
          writer.WriteObjectStart();
          writer.WriteProperty("callstack", (w) => this.callStack.WriteJson(w));
          writer.WriteProperty("outputStream", (w) => JsonSerialisation_1.JsonSerialisation.WriteListRuntimeObjs(w, this.outputStream));
          let hasChoiceThreads = false;
          for (let c of this.currentChoices) {
            if (c.threadAtGeneration === null)
              return NullException_1.throwNullException("c.threadAtGeneration");
            c.originalThreadIndex = c.threadAtGeneration.threadIndex;
            if (this.callStack.ThreadWithIndex(c.originalThreadIndex) === null) {
              if (!hasChoiceThreads) {
                hasChoiceThreads = true;
                writer.WritePropertyStart("choiceThreads");
                writer.WriteObjectStart();
              }
              writer.WritePropertyStart(c.originalThreadIndex);
              c.threadAtGeneration.WriteJson(writer);
              writer.WritePropertyEnd();
            }
          }
          if (hasChoiceThreads) {
            writer.WriteObjectEnd();
            writer.WritePropertyEnd();
          }
          writer.WriteProperty("currentChoices", (w) => {
            w.WriteArrayStart();
            for (let c of this.currentChoices) {
              JsonSerialisation_1.JsonSerialisation.WriteChoice(w, c);
            }
            w.WriteArrayEnd();
          });
          writer.WriteObjectEnd();
        }
        LoadFlowChoiceThreads(jChoiceThreads, story) {
          for (let choice of this.currentChoices) {
            let foundActiveThread = this.callStack.ThreadWithIndex(choice.originalThreadIndex);
            if (foundActiveThread !== null) {
              choice.threadAtGeneration = foundActiveThread.Copy();
            } else {
              let jSavedChoiceThread = jChoiceThreads[`${choice.originalThreadIndex}`];
              choice.threadAtGeneration = new CallStack_1.CallStack.Thread(jSavedChoiceThread, story);
            }
          }
        }
      };
      exports.Flow = Flow;
    }
  });

  // node_modules/inkjs/engine/StoryState.js
  var require_StoryState = __commonJS({
    "node_modules/inkjs/engine/StoryState.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StoryState = void 0;
      var CallStack_1 = require_CallStack();
      var VariablesState_1 = require_VariablesState();
      var Value_1 = require_Value();
      var PushPop_1 = require_PushPop();
      var Tag_1 = require_Tag();
      var Glue_1 = require_Glue();
      var Path_1 = require_Path();
      var ControlCommand_1 = require_ControlCommand();
      var StringBuilder_1 = require_StringBuilder();
      var JsonSerialisation_1 = require_JsonSerialisation();
      var PRNG_1 = require_PRNG();
      var Void_1 = require_Void();
      var Pointer_1 = require_Pointer();
      var TryGetResult_1 = require_TryGetResult();
      var TypeAssertion_1 = require_TypeAssertion();
      var Debug_1 = require_Debug();
      var NullException_1 = require_NullException();
      var Story_1 = require_Story();
      var StatePatch_1 = require_StatePatch();
      var SimpleJson_1 = require_SimpleJson();
      var Flow_1 = require_Flow();
      var InkList_1 = require_InkList();
      var StoryState = class {
        constructor(story) {
          this.kInkSaveStateVersion = 10;
          this.kMinCompatibleLoadVersion = 8;
          this.onDidLoadState = null;
          this._currentErrors = null;
          this._currentWarnings = null;
          this.divertedPointer = Pointer_1.Pointer.Null;
          this._currentTurnIndex = 0;
          this.storySeed = 0;
          this.previousRandom = 0;
          this.didSafeExit = false;
          this._currentText = null;
          this._currentTags = null;
          this._outputStreamTextDirty = true;
          this._outputStreamTagsDirty = true;
          this._patch = null;
          this._aliveFlowNames = null;
          this._namedFlows = null;
          this.kDefaultFlowName = "DEFAULT_FLOW";
          this._aliveFlowNamesDirty = true;
          this.story = story;
          this._currentFlow = new Flow_1.Flow(this.kDefaultFlowName, story);
          this.OutputStreamDirty();
          this._aliveFlowNamesDirty = true;
          this._evaluationStack = [];
          this._variablesState = new VariablesState_1.VariablesState(this.callStack, story.listDefinitions);
          this._visitCounts = /* @__PURE__ */ new Map();
          this._turnIndices = /* @__PURE__ */ new Map();
          this.currentTurnIndex = -1;
          let timeSeed = (/* @__PURE__ */ new Date()).getTime();
          this.storySeed = new PRNG_1.PRNG(timeSeed).next() % 100;
          this.previousRandom = 0;
          this.GoToStart();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ToJson(indented = false) {
          let writer = new SimpleJson_1.SimpleJson.Writer();
          this.WriteJson(writer);
          return writer.toString();
        }
        toJson(indented = false) {
          return this.ToJson(indented);
        }
        LoadJson(json) {
          let jObject = SimpleJson_1.SimpleJson.TextToDictionary(json);
          this.LoadJsonObj(jObject);
          if (this.onDidLoadState !== null)
            this.onDidLoadState();
        }
        VisitCountAtPathString(pathString) {
          let visitCountOut;
          if (this._patch !== null) {
            let container = this.story.ContentAtPath(new Path_1.Path(pathString)).container;
            if (container === null)
              throw new Error("Content at path not found: " + pathString);
            visitCountOut = this._patch.TryGetVisitCount(container, 0);
            if (visitCountOut.exists)
              return visitCountOut.result;
          }
          visitCountOut = TryGetResult_1.tryGetValueFromMap(this._visitCounts, pathString, null);
          if (visitCountOut.exists)
            return visitCountOut.result;
          return 0;
        }
        VisitCountForContainer(container) {
          if (container === null) {
            return NullException_1.throwNullException("container");
          }
          if (!container.visitsShouldBeCounted) {
            this.story.Error("Read count for target (" + container.name + " - on " + container.debugMetadata + ") unknown. The story may need to be compiled with countAllVisits flag (-c).");
            return 0;
          }
          if (this._patch !== null) {
            let count = this._patch.TryGetVisitCount(container, 0);
            if (count.exists) {
              return count.result;
            }
          }
          let containerPathStr = container.path.toString();
          let count2 = TryGetResult_1.tryGetValueFromMap(this._visitCounts, containerPathStr, null);
          if (count2.exists) {
            return count2.result;
          }
          return 0;
        }
        IncrementVisitCountForContainer(container) {
          if (this._patch !== null) {
            let currCount = this.VisitCountForContainer(container);
            currCount++;
            this._patch.SetVisitCount(container, currCount);
            return;
          }
          let containerPathStr = container.path.toString();
          let count = TryGetResult_1.tryGetValueFromMap(this._visitCounts, containerPathStr, null);
          if (count.exists) {
            this._visitCounts.set(containerPathStr, count.result + 1);
          } else {
            this._visitCounts.set(containerPathStr, 1);
          }
        }
        RecordTurnIndexVisitToContainer(container) {
          if (this._patch !== null) {
            this._patch.SetTurnIndex(container, this.currentTurnIndex);
            return;
          }
          let containerPathStr = container.path.toString();
          this._turnIndices.set(containerPathStr, this.currentTurnIndex);
        }
        TurnsSinceForContainer(container) {
          if (!container.turnIndexShouldBeCounted) {
            this.story.Error("TURNS_SINCE() for target (" + container.name + " - on " + container.debugMetadata + ") unknown. The story may need to be compiled with countAllVisits flag (-c).");
          }
          if (this._patch !== null) {
            let index = this._patch.TryGetTurnIndex(container, 0);
            if (index.exists) {
              return this.currentTurnIndex - index.result;
            }
          }
          let containerPathStr = container.path.toString();
          let index2 = TryGetResult_1.tryGetValueFromMap(this._turnIndices, containerPathStr, 0);
          if (index2.exists) {
            return this.currentTurnIndex - index2.result;
          } else {
            return -1;
          }
        }
        get callstackDepth() {
          return this.callStack.depth;
        }
        get outputStream() {
          return this._currentFlow.outputStream;
        }
        get currentChoices() {
          if (this.canContinue)
            return [];
          return this._currentFlow.currentChoices;
        }
        get generatedChoices() {
          return this._currentFlow.currentChoices;
        }
        get currentErrors() {
          return this._currentErrors;
        }
        get currentWarnings() {
          return this._currentWarnings;
        }
        get variablesState() {
          return this._variablesState;
        }
        set variablesState(value) {
          this._variablesState = value;
        }
        get callStack() {
          return this._currentFlow.callStack;
        }
        get evaluationStack() {
          return this._evaluationStack;
        }
        get currentTurnIndex() {
          return this._currentTurnIndex;
        }
        set currentTurnIndex(value) {
          this._currentTurnIndex = value;
        }
        get currentPathString() {
          let pointer = this.currentPointer;
          if (pointer.isNull) {
            return null;
          } else {
            if (pointer.path === null) {
              return NullException_1.throwNullException("pointer.path");
            }
            return pointer.path.toString();
          }
        }
        get currentPointer() {
          return this.callStack.currentElement.currentPointer.copy();
        }
        set currentPointer(value) {
          this.callStack.currentElement.currentPointer = value.copy();
        }
        get previousPointer() {
          return this.callStack.currentThread.previousPointer.copy();
        }
        set previousPointer(value) {
          this.callStack.currentThread.previousPointer = value.copy();
        }
        get canContinue() {
          return !this.currentPointer.isNull && !this.hasError;
        }
        get hasError() {
          return this.currentErrors != null && this.currentErrors.length > 0;
        }
        get hasWarning() {
          return this.currentWarnings != null && this.currentWarnings.length > 0;
        }
        get currentText() {
          if (this._outputStreamTextDirty) {
            let sb = new StringBuilder_1.StringBuilder();
            let inTag = false;
            for (let outputObj of this.outputStream) {
              let textContent = TypeAssertion_1.asOrNull(outputObj, Value_1.StringValue);
              if (!inTag && textContent !== null) {
                sb.Append(textContent.value);
              } else {
                let controlCommand = TypeAssertion_1.asOrNull(outputObj, ControlCommand_1.ControlCommand);
                if (controlCommand !== null) {
                  if (controlCommand.commandType == ControlCommand_1.ControlCommand.CommandType.BeginTag) {
                    inTag = true;
                  } else if (controlCommand.commandType == ControlCommand_1.ControlCommand.CommandType.EndTag) {
                    inTag = false;
                  }
                }
              }
            }
            this._currentText = this.CleanOutputWhitespace(sb.toString());
            this._outputStreamTextDirty = false;
          }
          return this._currentText;
        }
        CleanOutputWhitespace(str) {
          let sb = new StringBuilder_1.StringBuilder();
          let currentWhitespaceStart = -1;
          let startOfLine = 0;
          for (let i = 0; i < str.length; i++) {
            let c = str.charAt(i);
            let isInlineWhitespace = c == " " || c == "	";
            if (isInlineWhitespace && currentWhitespaceStart == -1)
              currentWhitespaceStart = i;
            if (!isInlineWhitespace) {
              if (c != "\n" && currentWhitespaceStart > 0 && currentWhitespaceStart != startOfLine) {
                sb.Append(" ");
              }
              currentWhitespaceStart = -1;
            }
            if (c == "\n")
              startOfLine = i + 1;
            if (!isInlineWhitespace)
              sb.Append(c);
          }
          return sb.toString();
        }
        get currentTags() {
          if (this._outputStreamTagsDirty) {
            this._currentTags = [];
            let inTag = false;
            let sb = new StringBuilder_1.StringBuilder();
            for (let outputObj of this.outputStream) {
              let controlCommand = TypeAssertion_1.asOrNull(outputObj, ControlCommand_1.ControlCommand);
              if (controlCommand != null) {
                if (controlCommand.commandType == ControlCommand_1.ControlCommand.CommandType.BeginTag) {
                  if (inTag && sb.Length > 0) {
                    let txt = this.CleanOutputWhitespace(sb.toString());
                    this._currentTags.push(txt);
                    sb.Clear();
                  }
                  inTag = true;
                } else if (controlCommand.commandType == ControlCommand_1.ControlCommand.CommandType.EndTag) {
                  if (sb.Length > 0) {
                    let txt = this.CleanOutputWhitespace(sb.toString());
                    this._currentTags.push(txt);
                    sb.Clear();
                  }
                  inTag = false;
                }
              } else if (inTag) {
                let strVal = TypeAssertion_1.asOrNull(outputObj, Value_1.StringValue);
                if (strVal !== null) {
                  sb.Append(strVal.value);
                }
              } else {
                let tag = TypeAssertion_1.asOrNull(outputObj, Tag_1.Tag);
                if (tag != null && tag.text != null && tag.text.length > 0) {
                  this._currentTags.push(tag.text);
                }
              }
            }
            if (sb.Length > 0) {
              let txt = this.CleanOutputWhitespace(sb.toString());
              this._currentTags.push(txt);
              sb.Clear();
            }
            this._outputStreamTagsDirty = false;
          }
          return this._currentTags;
        }
        get currentFlowName() {
          return this._currentFlow.name;
        }
        get currentFlowIsDefaultFlow() {
          return this._currentFlow.name == this.kDefaultFlowName;
        }
        get aliveFlowNames() {
          if (this._aliveFlowNamesDirty) {
            this._aliveFlowNames = [];
            if (this._namedFlows != null) {
              for (let flowName of this._namedFlows.keys()) {
                if (flowName != this.kDefaultFlowName) {
                  this._aliveFlowNames.push(flowName);
                }
              }
            }
            this._aliveFlowNamesDirty = false;
          }
          return this._aliveFlowNames;
        }
        get inExpressionEvaluation() {
          return this.callStack.currentElement.inExpressionEvaluation;
        }
        set inExpressionEvaluation(value) {
          this.callStack.currentElement.inExpressionEvaluation = value;
        }
        GoToStart() {
          this.callStack.currentElement.currentPointer = Pointer_1.Pointer.StartOf(this.story.mainContentContainer);
        }
        SwitchFlow_Internal(flowName) {
          if (flowName === null)
            throw new Error("Must pass a non-null string to Story.SwitchFlow");
          if (this._namedFlows === null) {
            this._namedFlows = /* @__PURE__ */ new Map();
            this._namedFlows.set(this.kDefaultFlowName, this._currentFlow);
          }
          if (flowName === this._currentFlow.name) {
            return;
          }
          let flow;
          let content = TryGetResult_1.tryGetValueFromMap(this._namedFlows, flowName, null);
          if (content.exists) {
            flow = content.result;
          } else {
            flow = new Flow_1.Flow(flowName, this.story);
            this._namedFlows.set(flowName, flow);
            this._aliveFlowNamesDirty = true;
          }
          this._currentFlow = flow;
          this.variablesState.callStack = this._currentFlow.callStack;
          this.OutputStreamDirty();
        }
        SwitchToDefaultFlow_Internal() {
          if (this._namedFlows === null)
            return;
          this.SwitchFlow_Internal(this.kDefaultFlowName);
        }
        RemoveFlow_Internal(flowName) {
          if (flowName === null)
            throw new Error("Must pass a non-null string to Story.DestroyFlow");
          if (flowName === this.kDefaultFlowName)
            throw new Error("Cannot destroy default flow");
          if (this._currentFlow.name === flowName) {
            this.SwitchToDefaultFlow_Internal();
          }
          if (this._namedFlows === null)
            return NullException_1.throwNullException("this._namedFlows");
          this._namedFlows.delete(flowName);
          this._aliveFlowNamesDirty = true;
        }
        CopyAndStartPatching() {
          let copy = new StoryState(this.story);
          copy._patch = new StatePatch_1.StatePatch(this._patch);
          copy._currentFlow.name = this._currentFlow.name;
          copy._currentFlow.callStack = new CallStack_1.CallStack(this._currentFlow.callStack);
          copy._currentFlow.currentChoices.push(...this._currentFlow.currentChoices);
          copy._currentFlow.outputStream.push(...this._currentFlow.outputStream);
          copy.OutputStreamDirty();
          if (this._namedFlows !== null) {
            copy._namedFlows = /* @__PURE__ */ new Map();
            for (let [namedFlowKey, namedFlowValue] of this._namedFlows) {
              copy._namedFlows.set(namedFlowKey, namedFlowValue);
              copy._aliveFlowNamesDirty = true;
            }
            copy._namedFlows.set(this._currentFlow.name, copy._currentFlow);
          }
          if (this.hasError) {
            copy._currentErrors = [];
            copy._currentErrors.push(...this.currentErrors || []);
          }
          if (this.hasWarning) {
            copy._currentWarnings = [];
            copy._currentWarnings.push(...this.currentWarnings || []);
          }
          copy.variablesState = this.variablesState;
          copy.variablesState.callStack = copy.callStack;
          copy.variablesState.patch = copy._patch;
          copy.evaluationStack.push(...this.evaluationStack);
          if (!this.divertedPointer.isNull)
            copy.divertedPointer = this.divertedPointer.copy();
          copy.previousPointer = this.previousPointer.copy();
          copy._visitCounts = this._visitCounts;
          copy._turnIndices = this._turnIndices;
          copy.currentTurnIndex = this.currentTurnIndex;
          copy.storySeed = this.storySeed;
          copy.previousRandom = this.previousRandom;
          copy.didSafeExit = this.didSafeExit;
          return copy;
        }
        RestoreAfterPatch() {
          this.variablesState.callStack = this.callStack;
          this.variablesState.patch = this._patch;
        }
        ApplyAnyPatch() {
          if (this._patch === null)
            return;
          this.variablesState.ApplyPatch();
          for (let [key, value] of this._patch.visitCounts)
            this.ApplyCountChanges(key, value, true);
          for (let [key, value] of this._patch.turnIndices)
            this.ApplyCountChanges(key, value, false);
          this._patch = null;
        }
        ApplyCountChanges(container, newCount, isVisit) {
          let counts = isVisit ? this._visitCounts : this._turnIndices;
          counts.set(container.path.toString(), newCount);
        }
        WriteJson(writer) {
          writer.WriteObjectStart();
          writer.WritePropertyStart("flows");
          writer.WriteObjectStart();
          if (this._namedFlows !== null) {
            for (let [namedFlowKey, namedFlowValue] of this._namedFlows) {
              writer.WriteProperty(namedFlowKey, (w) => namedFlowValue.WriteJson(w));
            }
          } else {
            writer.WriteProperty(this._currentFlow.name, (w) => this._currentFlow.WriteJson(w));
          }
          writer.WriteObjectEnd();
          writer.WritePropertyEnd();
          writer.WriteProperty("currentFlowName", this._currentFlow.name);
          writer.WriteProperty("variablesState", (w) => this.variablesState.WriteJson(w));
          writer.WriteProperty("evalStack", (w) => JsonSerialisation_1.JsonSerialisation.WriteListRuntimeObjs(w, this.evaluationStack));
          if (!this.divertedPointer.isNull) {
            if (this.divertedPointer.path === null) {
              return NullException_1.throwNullException("divertedPointer");
            }
            writer.WriteProperty("currentDivertTarget", this.divertedPointer.path.componentsString);
          }
          writer.WriteProperty("visitCounts", (w) => JsonSerialisation_1.JsonSerialisation.WriteIntDictionary(w, this._visitCounts));
          writer.WriteProperty("turnIndices", (w) => JsonSerialisation_1.JsonSerialisation.WriteIntDictionary(w, this._turnIndices));
          writer.WriteIntProperty("turnIdx", this.currentTurnIndex);
          writer.WriteIntProperty("storySeed", this.storySeed);
          writer.WriteIntProperty("previousRandom", this.previousRandom);
          writer.WriteIntProperty("inkSaveVersion", this.kInkSaveStateVersion);
          writer.WriteIntProperty("inkFormatVersion", Story_1.Story.inkVersionCurrent);
          writer.WriteObjectEnd();
        }
        LoadJsonObj(value) {
          let jObject = value;
          let jSaveVersion = jObject["inkSaveVersion"];
          if (jSaveVersion == null) {
            throw new Error("ink save format incorrect, can't load.");
          } else if (parseInt(jSaveVersion) < this.kMinCompatibleLoadVersion) {
            throw new Error("Ink save format isn't compatible with the current version (saw '" + jSaveVersion + "', but minimum is " + this.kMinCompatibleLoadVersion + "), so can't load.");
          }
          let flowsObj = jObject["flows"];
          if (flowsObj != null) {
            let flowsObjDict = flowsObj;
            if (Object.keys(flowsObjDict).length === 1) {
              this._namedFlows = null;
            } else if (this._namedFlows === null) {
              this._namedFlows = /* @__PURE__ */ new Map();
            } else {
              this._namedFlows.clear();
            }
            let flowsObjDictEntries = Object.entries(flowsObjDict);
            for (let [namedFlowObjKey, namedFlowObjValue] of flowsObjDictEntries) {
              let name = namedFlowObjKey;
              let flowObj = namedFlowObjValue;
              let flow = new Flow_1.Flow(name, this.story, flowObj);
              if (Object.keys(flowsObjDict).length === 1) {
                this._currentFlow = new Flow_1.Flow(name, this.story, flowObj);
              } else {
                if (this._namedFlows === null)
                  return NullException_1.throwNullException("this._namedFlows");
                this._namedFlows.set(name, flow);
              }
            }
            if (this._namedFlows != null && this._namedFlows.size > 1) {
              let currFlowName = jObject["currentFlowName"];
              this._currentFlow = this._namedFlows.get(currFlowName);
            }
          } else {
            this._namedFlows = null;
            this._currentFlow.name = this.kDefaultFlowName;
            this._currentFlow.callStack.SetJsonToken(jObject["callstackThreads"], this.story);
            this._currentFlow.outputStream = JsonSerialisation_1.JsonSerialisation.JArrayToRuntimeObjList(jObject["outputStream"]);
            this._currentFlow.currentChoices = JsonSerialisation_1.JsonSerialisation.JArrayToRuntimeObjList(jObject["currentChoices"]);
            let jChoiceThreadsObj = jObject["choiceThreads"];
            this._currentFlow.LoadFlowChoiceThreads(jChoiceThreadsObj, this.story);
          }
          this.OutputStreamDirty();
          this._aliveFlowNamesDirty = true;
          this.variablesState.SetJsonToken(jObject["variablesState"]);
          this.variablesState.callStack = this._currentFlow.callStack;
          this._evaluationStack = JsonSerialisation_1.JsonSerialisation.JArrayToRuntimeObjList(jObject["evalStack"]);
          let currentDivertTargetPath = jObject["currentDivertTarget"];
          if (currentDivertTargetPath != null) {
            let divertPath = new Path_1.Path(currentDivertTargetPath.toString());
            this.divertedPointer = this.story.PointerAtPath(divertPath);
          }
          this._visitCounts = JsonSerialisation_1.JsonSerialisation.JObjectToIntDictionary(jObject["visitCounts"]);
          this._turnIndices = JsonSerialisation_1.JsonSerialisation.JObjectToIntDictionary(jObject["turnIndices"]);
          this.currentTurnIndex = parseInt(jObject["turnIdx"]);
          this.storySeed = parseInt(jObject["storySeed"]);
          this.previousRandom = parseInt(jObject["previousRandom"]);
        }
        ResetErrors() {
          this._currentErrors = null;
          this._currentWarnings = null;
        }
        ResetOutput(objs = null) {
          this.outputStream.length = 0;
          if (objs !== null)
            this.outputStream.push(...objs);
          this.OutputStreamDirty();
        }
        PushToOutputStream(obj) {
          let text = TypeAssertion_1.asOrNull(obj, Value_1.StringValue);
          if (text !== null) {
            let listText = this.TrySplittingHeadTailWhitespace(text);
            if (listText !== null) {
              for (let textObj of listText) {
                this.PushToOutputStreamIndividual(textObj);
              }
              this.OutputStreamDirty();
              return;
            }
          }
          this.PushToOutputStreamIndividual(obj);
          this.OutputStreamDirty();
        }
        PopFromOutputStream(count) {
          this.outputStream.splice(this.outputStream.length - count, count);
          this.OutputStreamDirty();
        }
        TrySplittingHeadTailWhitespace(single) {
          let str = single.value;
          if (str === null) {
            return NullException_1.throwNullException("single.value");
          }
          let headFirstNewlineIdx = -1;
          let headLastNewlineIdx = -1;
          for (let i = 0; i < str.length; i++) {
            let c = str[i];
            if (c == "\n") {
              if (headFirstNewlineIdx == -1)
                headFirstNewlineIdx = i;
              headLastNewlineIdx = i;
            } else if (c == " " || c == "	")
              continue;
            else
              break;
          }
          let tailLastNewlineIdx = -1;
          let tailFirstNewlineIdx = -1;
          for (let i = str.length - 1; i >= 0; i--) {
            let c = str[i];
            if (c == "\n") {
              if (tailLastNewlineIdx == -1)
                tailLastNewlineIdx = i;
              tailFirstNewlineIdx = i;
            } else if (c == " " || c == "	")
              continue;
            else
              break;
          }
          if (headFirstNewlineIdx == -1 && tailLastNewlineIdx == -1)
            return null;
          let listTexts = [];
          let innerStrStart = 0;
          let innerStrEnd = str.length;
          if (headFirstNewlineIdx != -1) {
            if (headFirstNewlineIdx > 0) {
              let leadingSpaces = new Value_1.StringValue(str.substring(0, headFirstNewlineIdx));
              listTexts.push(leadingSpaces);
            }
            listTexts.push(new Value_1.StringValue("\n"));
            innerStrStart = headLastNewlineIdx + 1;
          }
          if (tailLastNewlineIdx != -1) {
            innerStrEnd = tailFirstNewlineIdx;
          }
          if (innerStrEnd > innerStrStart) {
            let innerStrText = str.substring(innerStrStart, innerStrEnd);
            listTexts.push(new Value_1.StringValue(innerStrText));
          }
          if (tailLastNewlineIdx != -1 && tailFirstNewlineIdx > headLastNewlineIdx) {
            listTexts.push(new Value_1.StringValue("\n"));
            if (tailLastNewlineIdx < str.length - 1) {
              let numSpaces = str.length - tailLastNewlineIdx - 1;
              let trailingSpaces = new Value_1.StringValue(str.substring(tailLastNewlineIdx + 1, tailLastNewlineIdx + 1 + numSpaces));
              listTexts.push(trailingSpaces);
            }
          }
          return listTexts;
        }
        PushToOutputStreamIndividual(obj) {
          let glue = TypeAssertion_1.asOrNull(obj, Glue_1.Glue);
          let text = TypeAssertion_1.asOrNull(obj, Value_1.StringValue);
          let includeInOutput = true;
          if (glue) {
            this.TrimNewlinesFromOutputStream();
            includeInOutput = true;
          } else if (text) {
            let functionTrimIndex = -1;
            let currEl = this.callStack.currentElement;
            if (currEl.type == PushPop_1.PushPopType.Function) {
              functionTrimIndex = currEl.functionStartInOutputStream;
            }
            let glueTrimIndex = -1;
            for (let i = this.outputStream.length - 1; i >= 0; i--) {
              let o = this.outputStream[i];
              let c = o instanceof ControlCommand_1.ControlCommand ? o : null;
              let g = o instanceof Glue_1.Glue ? o : null;
              if (g != null) {
                glueTrimIndex = i;
                break;
              } else if (c != null && c.commandType == ControlCommand_1.ControlCommand.CommandType.BeginString) {
                if (i >= functionTrimIndex) {
                  functionTrimIndex = -1;
                }
                break;
              }
            }
            let trimIndex = -1;
            if (glueTrimIndex != -1 && functionTrimIndex != -1)
              trimIndex = Math.min(functionTrimIndex, glueTrimIndex);
            else if (glueTrimIndex != -1)
              trimIndex = glueTrimIndex;
            else
              trimIndex = functionTrimIndex;
            if (trimIndex != -1) {
              if (text.isNewline) {
                includeInOutput = false;
              } else if (text.isNonWhitespace) {
                if (glueTrimIndex > -1)
                  this.RemoveExistingGlue();
                if (functionTrimIndex > -1) {
                  let callStackElements = this.callStack.elements;
                  for (let i = callStackElements.length - 1; i >= 0; i--) {
                    let el = callStackElements[i];
                    if (el.type == PushPop_1.PushPopType.Function) {
                      el.functionStartInOutputStream = -1;
                    } else {
                      break;
                    }
                  }
                }
              }
            } else if (text.isNewline) {
              if (this.outputStreamEndsInNewline || !this.outputStreamContainsContent)
                includeInOutput = false;
            }
          }
          if (includeInOutput) {
            if (obj === null) {
              return NullException_1.throwNullException("obj");
            }
            this.outputStream.push(obj);
            this.OutputStreamDirty();
          }
        }
        TrimNewlinesFromOutputStream() {
          let removeWhitespaceFrom = -1;
          let i = this.outputStream.length - 1;
          while (i >= 0) {
            let obj = this.outputStream[i];
            let cmd = TypeAssertion_1.asOrNull(obj, ControlCommand_1.ControlCommand);
            let txt = TypeAssertion_1.asOrNull(obj, Value_1.StringValue);
            if (cmd != null || txt != null && txt.isNonWhitespace) {
              break;
            } else if (txt != null && txt.isNewline) {
              removeWhitespaceFrom = i;
            }
            i--;
          }
          if (removeWhitespaceFrom >= 0) {
            i = removeWhitespaceFrom;
            while (i < this.outputStream.length) {
              let text = TypeAssertion_1.asOrNull(this.outputStream[i], Value_1.StringValue);
              if (text) {
                this.outputStream.splice(i, 1);
              } else {
                i++;
              }
            }
          }
          this.OutputStreamDirty();
        }
        RemoveExistingGlue() {
          for (let i = this.outputStream.length - 1; i >= 0; i--) {
            let c = this.outputStream[i];
            if (c instanceof Glue_1.Glue) {
              this.outputStream.splice(i, 1);
            } else if (c instanceof ControlCommand_1.ControlCommand) {
              break;
            }
          }
          this.OutputStreamDirty();
        }
        get outputStreamEndsInNewline() {
          if (this.outputStream.length > 0) {
            for (let i = this.outputStream.length - 1; i >= 0; i--) {
              let obj = this.outputStream[i];
              if (obj instanceof ControlCommand_1.ControlCommand)
                break;
              let text = this.outputStream[i];
              if (text instanceof Value_1.StringValue) {
                if (text.isNewline)
                  return true;
                else if (text.isNonWhitespace)
                  break;
              }
            }
          }
          return false;
        }
        get outputStreamContainsContent() {
          for (let content of this.outputStream) {
            if (content instanceof Value_1.StringValue)
              return true;
          }
          return false;
        }
        get inStringEvaluation() {
          for (let i = this.outputStream.length - 1; i >= 0; i--) {
            let cmd = TypeAssertion_1.asOrNull(this.outputStream[i], ControlCommand_1.ControlCommand);
            if (cmd instanceof ControlCommand_1.ControlCommand && cmd.commandType == ControlCommand_1.ControlCommand.CommandType.BeginString) {
              return true;
            }
          }
          return false;
        }
        PushEvaluationStack(obj) {
          let listValue = TypeAssertion_1.asOrNull(obj, Value_1.ListValue);
          if (listValue) {
            let rawList = listValue.value;
            if (rawList === null) {
              return NullException_1.throwNullException("rawList");
            }
            if (rawList.originNames != null) {
              if (!rawList.origins)
                rawList.origins = [];
              rawList.origins.length = 0;
              for (let n of rawList.originNames) {
                if (this.story.listDefinitions === null)
                  return NullException_1.throwNullException("StoryState.story.listDefinitions");
                let def = this.story.listDefinitions.TryListGetDefinition(n, null);
                if (def.result === null)
                  return NullException_1.throwNullException("StoryState def.result");
                if (rawList.origins.indexOf(def.result) < 0)
                  rawList.origins.push(def.result);
              }
            }
          }
          if (obj === null) {
            return NullException_1.throwNullException("obj");
          }
          this.evaluationStack.push(obj);
        }
        PopEvaluationStack(numberOfObjects) {
          if (typeof numberOfObjects === "undefined") {
            let obj = this.evaluationStack.pop();
            return TypeAssertion_1.nullIfUndefined(obj);
          } else {
            if (numberOfObjects > this.evaluationStack.length) {
              throw new Error("trying to pop too many objects");
            }
            let popped = this.evaluationStack.splice(this.evaluationStack.length - numberOfObjects, numberOfObjects);
            return TypeAssertion_1.nullIfUndefined(popped);
          }
        }
        PeekEvaluationStack() {
          return this.evaluationStack[this.evaluationStack.length - 1];
        }
        ForceEnd() {
          this.callStack.Reset();
          this._currentFlow.currentChoices.length = 0;
          this.currentPointer = Pointer_1.Pointer.Null;
          this.previousPointer = Pointer_1.Pointer.Null;
          this.didSafeExit = true;
        }
        TrimWhitespaceFromFunctionEnd() {
          Debug_1.Debug.Assert(this.callStack.currentElement.type == PushPop_1.PushPopType.Function);
          let functionStartPoint = this.callStack.currentElement.functionStartInOutputStream;
          if (functionStartPoint == -1) {
            functionStartPoint = 0;
          }
          for (let i = this.outputStream.length - 1; i >= functionStartPoint; i--) {
            let obj = this.outputStream[i];
            let txt = TypeAssertion_1.asOrNull(obj, Value_1.StringValue);
            let cmd = TypeAssertion_1.asOrNull(obj, ControlCommand_1.ControlCommand);
            if (txt == null)
              continue;
            if (cmd)
              break;
            if (txt.isNewline || txt.isInlineWhitespace) {
              this.outputStream.splice(i, 1);
              this.OutputStreamDirty();
            } else {
              break;
            }
          }
        }
        PopCallStack(popType = null) {
          if (this.callStack.currentElement.type == PushPop_1.PushPopType.Function)
            this.TrimWhitespaceFromFunctionEnd();
          this.callStack.Pop(popType);
        }
        SetChosenPath(path, incrementingTurnIndex) {
          this._currentFlow.currentChoices.length = 0;
          let newPointer = this.story.PointerAtPath(path);
          if (!newPointer.isNull && newPointer.index == -1)
            newPointer.index = 0;
          this.currentPointer = newPointer;
          if (incrementingTurnIndex) {
            this.currentTurnIndex++;
          }
        }
        StartFunctionEvaluationFromGame(funcContainer, args) {
          this.callStack.Push(PushPop_1.PushPopType.FunctionEvaluationFromGame, this.evaluationStack.length);
          this.callStack.currentElement.currentPointer = Pointer_1.Pointer.StartOf(funcContainer);
          this.PassArgumentsToEvaluationStack(args);
        }
        PassArgumentsToEvaluationStack(args) {
          if (args !== null) {
            for (let i = 0; i < args.length; i++) {
              if (!(typeof args[i] === "number" || typeof args[i] === "string" || typeof args[i] === "boolean" || args[i] instanceof InkList_1.InkList)) {
                throw new Error("ink arguments when calling EvaluateFunction / ChoosePathStringWithParameters must benumber, string, bool or InkList. Argument was " + (TypeAssertion_1.nullIfUndefined(arguments[i]) === null) ? "null" : arguments[i].constructor.name);
              }
              this.PushEvaluationStack(Value_1.Value.Create(args[i]));
            }
          }
        }
        TryExitFunctionEvaluationFromGame() {
          if (this.callStack.currentElement.type == PushPop_1.PushPopType.FunctionEvaluationFromGame) {
            this.currentPointer = Pointer_1.Pointer.Null;
            this.didSafeExit = true;
            return true;
          }
          return false;
        }
        CompleteFunctionEvaluationFromGame() {
          if (this.callStack.currentElement.type != PushPop_1.PushPopType.FunctionEvaluationFromGame) {
            throw new Error("Expected external function evaluation to be complete. Stack trace: " + this.callStack.callStackTrace);
          }
          let originalEvaluationStackHeight = this.callStack.currentElement.evaluationStackHeightWhenPushed;
          let returnedObj = null;
          while (this.evaluationStack.length > originalEvaluationStackHeight) {
            let poppedObj = this.PopEvaluationStack();
            if (returnedObj === null)
              returnedObj = poppedObj;
          }
          this.PopCallStack(PushPop_1.PushPopType.FunctionEvaluationFromGame);
          if (returnedObj) {
            if (returnedObj instanceof Void_1.Void)
              return null;
            let returnVal = TypeAssertion_1.asOrThrows(returnedObj, Value_1.Value);
            if (returnVal.valueType == Value_1.ValueType.DivertTarget) {
              return returnVal.valueObject.toString();
            }
            return returnVal.valueObject;
          }
          return null;
        }
        AddError(message, isWarning) {
          if (!isWarning) {
            if (this._currentErrors == null)
              this._currentErrors = [];
            this._currentErrors.push(message);
          } else {
            if (this._currentWarnings == null)
              this._currentWarnings = [];
            this._currentWarnings.push(message);
          }
        }
        OutputStreamDirty() {
          this._outputStreamTextDirty = true;
          this._outputStreamTagsDirty = true;
        }
      };
      exports.StoryState = StoryState;
    }
  });

  // node_modules/inkjs/engine/StopWatch.js
  var require_StopWatch = __commonJS({
    "node_modules/inkjs/engine/StopWatch.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Stopwatch = void 0;
      var Stopwatch = class {
        constructor() {
          this.startTime = void 0;
        }
        get ElapsedMilliseconds() {
          if (typeof this.startTime === "undefined") {
            return 0;
          }
          return (/* @__PURE__ */ new Date()).getTime() - this.startTime;
        }
        Start() {
          this.startTime = (/* @__PURE__ */ new Date()).getTime();
        }
        Stop() {
          this.startTime = void 0;
        }
      };
      exports.Stopwatch = Stopwatch;
    }
  });

  // node_modules/inkjs/engine/Error.js
  var require_Error = __commonJS({
    "node_modules/inkjs/engine/Error.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ErrorType = void 0;
      var ErrorType;
      (function(ErrorType2) {
        ErrorType2[ErrorType2["Author"] = 0] = "Author";
        ErrorType2[ErrorType2["Warning"] = 1] = "Warning";
        ErrorType2[ErrorType2["Error"] = 2] = "Error";
      })(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
    }
  });

  // node_modules/inkjs/engine/Story.js
  var require_Story = __commonJS({
    "node_modules/inkjs/engine/Story.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Story = exports.InkList = void 0;
      var Container_1 = require_Container();
      var Object_1 = require_Object();
      var JsonSerialisation_1 = require_JsonSerialisation();
      var StoryState_1 = require_StoryState();
      var ControlCommand_1 = require_ControlCommand();
      var PushPop_1 = require_PushPop();
      var ChoicePoint_1 = require_ChoicePoint();
      var Choice_1 = require_Choice();
      var Divert_1 = require_Divert();
      var Value_1 = require_Value();
      var Path_1 = require_Path();
      var Void_1 = require_Void();
      var Tag_1 = require_Tag();
      var VariableAssignment_1 = require_VariableAssignment();
      var VariableReference_1 = require_VariableReference();
      var NativeFunctionCall_1 = require_NativeFunctionCall();
      var StoryException_1 = require_StoryException();
      var PRNG_1 = require_PRNG();
      var StringBuilder_1 = require_StringBuilder();
      var ListDefinitionsOrigin_1 = require_ListDefinitionsOrigin();
      var StopWatch_1 = require_StopWatch();
      var Pointer_1 = require_Pointer();
      var InkList_1 = require_InkList();
      var TypeAssertion_1 = require_TypeAssertion();
      var NullException_1 = require_NullException();
      var SimpleJson_1 = require_SimpleJson();
      var Error_1 = require_Error();
      var InkList_2 = require_InkList();
      Object.defineProperty(exports, "InkList", { enumerable: true, get: function() {
        return InkList_2.InkList;
      } });
      if (!Number.isInteger) {
        Number.isInteger = function isInteger(nVal) {
          return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
        };
      }
      var Story2 = class extends Object_1.InkObject {
        constructor() {
          super();
          this.inkVersionMinimumCompatible = 18;
          this.onError = null;
          this.onDidContinue = null;
          this.onMakeChoice = null;
          this.onEvaluateFunction = null;
          this.onCompleteEvaluateFunction = null;
          this.onChoosePathString = null;
          this._prevContainers = [];
          this.allowExternalFunctionFallbacks = false;
          this._listDefinitions = null;
          this._variableObservers = null;
          this._hasValidatedExternals = false;
          this._temporaryEvaluationContainer = null;
          this._asyncContinueActive = false;
          this._stateSnapshotAtLastNewline = null;
          this._sawLookaheadUnsafeFunctionAfterNewline = false;
          this._recursiveContinueCount = 0;
          this._asyncSaving = false;
          this._profiler = null;
          let contentContainer;
          let lists = null;
          let json = null;
          if (arguments[0] instanceof Container_1.Container) {
            contentContainer = arguments[0];
            if (typeof arguments[1] !== "undefined") {
              lists = arguments[1];
            }
            this._mainContentContainer = contentContainer;
          } else {
            if (typeof arguments[0] === "string") {
              let jsonString = arguments[0];
              json = SimpleJson_1.SimpleJson.TextToDictionary(jsonString);
            } else {
              json = arguments[0];
            }
          }
          if (lists != null)
            this._listDefinitions = new ListDefinitionsOrigin_1.ListDefinitionsOrigin(lists);
          this._externals = /* @__PURE__ */ new Map();
          if (json !== null) {
            let rootObject = json;
            let versionObj = rootObject["inkVersion"];
            if (versionObj == null)
              throw new Error("ink version number not found. Are you sure it's a valid .ink.json file?");
            let formatFromFile = parseInt(versionObj);
            if (formatFromFile > Story2.inkVersionCurrent) {
              throw new Error("Version of ink used to build story was newer than the current version of the engine");
            } else if (formatFromFile < this.inkVersionMinimumCompatible) {
              throw new Error("Version of ink used to build story is too old to be loaded by this version of the engine");
            } else if (formatFromFile != Story2.inkVersionCurrent) {
              console.warn("WARNING: Version of ink used to build story doesn't match current version of engine. Non-critical, but recommend synchronising.");
            }
            let rootToken = rootObject["root"];
            if (rootToken == null)
              throw new Error("Root node for ink not found. Are you sure it's a valid .ink.json file?");
            let listDefsObj;
            if (listDefsObj = rootObject["listDefs"]) {
              this._listDefinitions = JsonSerialisation_1.JsonSerialisation.JTokenToListDefinitions(listDefsObj);
            }
            this._mainContentContainer = TypeAssertion_1.asOrThrows(JsonSerialisation_1.JsonSerialisation.JTokenToRuntimeObject(rootToken), Container_1.Container);
            this.ResetState();
          }
        }
        get currentChoices() {
          let choices = [];
          if (this._state === null) {
            return NullException_1.throwNullException("this._state");
          }
          for (let c of this._state.currentChoices) {
            if (!c.isInvisibleDefault) {
              c.index = choices.length;
              choices.push(c);
            }
          }
          return choices;
        }
        get currentText() {
          this.IfAsyncWeCant("call currentText since it's a work in progress");
          return this.state.currentText;
        }
        get currentTags() {
          this.IfAsyncWeCant("call currentTags since it's a work in progress");
          return this.state.currentTags;
        }
        get currentErrors() {
          return this.state.currentErrors;
        }
        get currentWarnings() {
          return this.state.currentWarnings;
        }
        get currentFlowName() {
          return this.state.currentFlowName;
        }
        get currentFlowIsDefaultFlow() {
          return this.state.currentFlowIsDefaultFlow;
        }
        get aliveFlowNames() {
          return this.state.aliveFlowNames;
        }
        get hasError() {
          return this.state.hasError;
        }
        get hasWarning() {
          return this.state.hasWarning;
        }
        get variablesState() {
          return this.state.variablesState;
        }
        get listDefinitions() {
          return this._listDefinitions;
        }
        get state() {
          return this._state;
        }
        // TODO: Implement Profiler
        StartProfiling() {
        }
        EndProfiling() {
        }
        // Merge together `public string ToJson()` and `void ToJson(SimpleJson.Writer writer)`.
        // Will only return a value if writer was not provided.
        ToJson(writer) {
          let shouldReturn = false;
          if (!writer) {
            shouldReturn = true;
            writer = new SimpleJson_1.SimpleJson.Writer();
          }
          writer.WriteObjectStart();
          writer.WriteIntProperty("inkVersion", Story2.inkVersionCurrent);
          writer.WriteProperty("root", (w) => JsonSerialisation_1.JsonSerialisation.WriteRuntimeContainer(w, this._mainContentContainer));
          if (this._listDefinitions != null) {
            writer.WritePropertyStart("listDefs");
            writer.WriteObjectStart();
            for (let def of this._listDefinitions.lists) {
              writer.WritePropertyStart(def.name);
              writer.WriteObjectStart();
              for (let [key, value] of def.items) {
                let item = InkList_1.InkListItem.fromSerializedKey(key);
                let val = value;
                writer.WriteIntProperty(item.itemName, val);
              }
              writer.WriteObjectEnd();
              writer.WritePropertyEnd();
            }
            writer.WriteObjectEnd();
            writer.WritePropertyEnd();
          }
          writer.WriteObjectEnd();
          if (shouldReturn)
            return writer.toString();
        }
        ResetState() {
          this.IfAsyncWeCant("ResetState");
          this._state = new StoryState_1.StoryState(this);
          this._state.variablesState.ObserveVariableChange(this.VariableStateDidChangeEvent.bind(this));
          this.ResetGlobals();
        }
        ResetErrors() {
          if (this._state === null) {
            return NullException_1.throwNullException("this._state");
          }
          this._state.ResetErrors();
        }
        ResetCallstack() {
          this.IfAsyncWeCant("ResetCallstack");
          if (this._state === null) {
            return NullException_1.throwNullException("this._state");
          }
          this._state.ForceEnd();
        }
        ResetGlobals() {
          if (this._mainContentContainer.namedContent.get("global decl")) {
            let originalPointer = this.state.currentPointer.copy();
            this.ChoosePath(new Path_1.Path("global decl"), false);
            this.ContinueInternal();
            this.state.currentPointer = originalPointer;
          }
          this.state.variablesState.SnapshotDefaultGlobals();
        }
        SwitchFlow(flowName) {
          this.IfAsyncWeCant("switch flow");
          if (this._asyncSaving) {
            throw new Error("Story is already in background saving mode, can't switch flow to " + flowName);
          }
          this.state.SwitchFlow_Internal(flowName);
        }
        RemoveFlow(flowName) {
          this.state.RemoveFlow_Internal(flowName);
        }
        SwitchToDefaultFlow() {
          this.state.SwitchToDefaultFlow_Internal();
        }
        Continue() {
          this.ContinueAsync(0);
          return this.currentText;
        }
        get canContinue() {
          return this.state.canContinue;
        }
        get asyncContinueComplete() {
          return !this._asyncContinueActive;
        }
        ContinueAsync(millisecsLimitAsync) {
          if (!this._hasValidatedExternals)
            this.ValidateExternalBindings();
          this.ContinueInternal(millisecsLimitAsync);
        }
        ContinueInternal(millisecsLimitAsync = 0) {
          if (this._profiler != null)
            this._profiler.PreContinue();
          let isAsyncTimeLimited = millisecsLimitAsync > 0;
          this._recursiveContinueCount++;
          if (!this._asyncContinueActive) {
            this._asyncContinueActive = isAsyncTimeLimited;
            if (!this.canContinue) {
              throw new Error("Can't continue - should check canContinue before calling Continue");
            }
            this._state.didSafeExit = false;
            this._state.ResetOutput();
            if (this._recursiveContinueCount == 1)
              this._state.variablesState.batchObservingVariableChanges = true;
          }
          let durationStopwatch = new StopWatch_1.Stopwatch();
          durationStopwatch.Start();
          let outputStreamEndsInNewline = false;
          this._sawLookaheadUnsafeFunctionAfterNewline = false;
          do {
            try {
              outputStreamEndsInNewline = this.ContinueSingleStep();
            } catch (e) {
              if (!(e instanceof StoryException_1.StoryException))
                throw e;
              this.AddError(e.message, void 0, e.useEndLineNumber);
              break;
            }
            if (outputStreamEndsInNewline)
              break;
            if (this._asyncContinueActive && durationStopwatch.ElapsedMilliseconds > millisecsLimitAsync) {
              break;
            }
          } while (this.canContinue);
          durationStopwatch.Stop();
          if (outputStreamEndsInNewline || !this.canContinue) {
            if (this._stateSnapshotAtLastNewline !== null) {
              this.RestoreStateSnapshot();
            }
            if (!this.canContinue) {
              if (this.state.callStack.canPopThread)
                this.AddError("Thread available to pop, threads should always be flat by the end of evaluation?");
              if (this.state.generatedChoices.length == 0 && !this.state.didSafeExit && this._temporaryEvaluationContainer == null) {
                if (this.state.callStack.CanPop(PushPop_1.PushPopType.Tunnel))
                  this.AddError("unexpectedly reached end of content. Do you need a '->->' to return from a tunnel?");
                else if (this.state.callStack.CanPop(PushPop_1.PushPopType.Function))
                  this.AddError("unexpectedly reached end of content. Do you need a '~ return'?");
                else if (!this.state.callStack.canPop)
                  this.AddError("ran out of content. Do you need a '-> DONE' or '-> END'?");
                else
                  this.AddError("unexpectedly reached end of content for unknown reason. Please debug compiler!");
              }
            }
            this.state.didSafeExit = false;
            this._sawLookaheadUnsafeFunctionAfterNewline = false;
            if (this._recursiveContinueCount == 1)
              this._state.variablesState.batchObservingVariableChanges = false;
            this._asyncContinueActive = false;
            if (this.onDidContinue !== null)
              this.onDidContinue();
          }
          this._recursiveContinueCount--;
          if (this._profiler != null)
            this._profiler.PostContinue();
          if (this.state.hasError || this.state.hasWarning) {
            if (this.onError !== null) {
              if (this.state.hasError) {
                for (let err of this.state.currentErrors) {
                  this.onError(err, Error_1.ErrorType.Error);
                }
              }
              if (this.state.hasWarning) {
                for (let err of this.state.currentWarnings) {
                  this.onError(err, Error_1.ErrorType.Warning);
                }
              }
              this.ResetErrors();
            } else {
              let sb = new StringBuilder_1.StringBuilder();
              sb.Append("Ink had ");
              if (this.state.hasError) {
                sb.Append(`${this.state.currentErrors.length}`);
                sb.Append(this.state.currentErrors.length == 1 ? " error" : "errors");
                if (this.state.hasWarning)
                  sb.Append(" and ");
              }
              if (this.state.hasWarning) {
                sb.Append(`${this.state.currentWarnings.length}`);
                sb.Append(this.state.currentWarnings.length == 1 ? " warning" : "warnings");
                if (this.state.hasWarning)
                  sb.Append(" and ");
              }
              sb.Append(". It is strongly suggested that you assign an error handler to story.onError. The first issue was: ");
              sb.Append(this.state.hasError ? this.state.currentErrors[0] : this.state.currentWarnings[0]);
              throw new StoryException_1.StoryException(sb.toString());
            }
          }
        }
        ContinueSingleStep() {
          if (this._profiler != null)
            this._profiler.PreStep();
          this.Step();
          if (this._profiler != null)
            this._profiler.PostStep();
          if (!this.canContinue && !this.state.callStack.elementIsEvaluateFromGame) {
            this.TryFollowDefaultInvisibleChoice();
          }
          if (this._profiler != null)
            this._profiler.PreSnapshot();
          if (!this.state.inStringEvaluation) {
            if (this._stateSnapshotAtLastNewline !== null) {
              if (this._stateSnapshotAtLastNewline.currentTags === null) {
                return NullException_1.throwNullException("this._stateAtLastNewline.currentTags");
              }
              if (this.state.currentTags === null) {
                return NullException_1.throwNullException("this.state.currentTags");
              }
              let change = this.CalculateNewlineOutputStateChange(this._stateSnapshotAtLastNewline.currentText, this.state.currentText, this._stateSnapshotAtLastNewline.currentTags.length, this.state.currentTags.length);
              if (change == Story2.OutputStateChange.ExtendedBeyondNewline || this._sawLookaheadUnsafeFunctionAfterNewline) {
                this.RestoreStateSnapshot();
                return true;
              } else if (change == Story2.OutputStateChange.NewlineRemoved) {
                this.DiscardSnapshot();
              }
            }
            if (this.state.outputStreamEndsInNewline) {
              if (this.canContinue) {
                if (this._stateSnapshotAtLastNewline == null)
                  this.StateSnapshot();
              } else {
                this.DiscardSnapshot();
              }
            }
          }
          if (this._profiler != null)
            this._profiler.PostSnapshot();
          return false;
        }
        CalculateNewlineOutputStateChange(prevText, currText, prevTagCount, currTagCount) {
          if (prevText === null) {
            return NullException_1.throwNullException("prevText");
          }
          if (currText === null) {
            return NullException_1.throwNullException("currText");
          }
          let newlineStillExists = currText.length >= prevText.length && prevText.length > 0 && currText.charAt(prevText.length - 1) == "\n";
          if (prevTagCount == currTagCount && prevText.length == currText.length && newlineStillExists)
            return Story2.OutputStateChange.NoChange;
          if (!newlineStillExists) {
            return Story2.OutputStateChange.NewlineRemoved;
          }
          if (currTagCount > prevTagCount)
            return Story2.OutputStateChange.ExtendedBeyondNewline;
          for (let i = prevText.length; i < currText.length; i++) {
            let c = currText.charAt(i);
            if (c != " " && c != "	") {
              return Story2.OutputStateChange.ExtendedBeyondNewline;
            }
          }
          return Story2.OutputStateChange.NoChange;
        }
        ContinueMaximally() {
          this.IfAsyncWeCant("ContinueMaximally");
          let sb = new StringBuilder_1.StringBuilder();
          while (this.canContinue) {
            sb.Append(this.Continue());
          }
          return sb.toString();
        }
        ContentAtPath(path) {
          return this.mainContentContainer.ContentAtPath(path);
        }
        KnotContainerWithName(name) {
          let namedContainer = this.mainContentContainer.namedContent.get(name);
          if (namedContainer instanceof Container_1.Container)
            return namedContainer;
          else
            return null;
        }
        PointerAtPath(path) {
          if (path.length == 0)
            return Pointer_1.Pointer.Null;
          let p = new Pointer_1.Pointer();
          let pathLengthToUse = path.length;
          let result = null;
          if (path.lastComponent === null) {
            return NullException_1.throwNullException("path.lastComponent");
          }
          if (path.lastComponent.isIndex) {
            pathLengthToUse = path.length - 1;
            result = this.mainContentContainer.ContentAtPath(path, void 0, pathLengthToUse);
            p.container = result.container;
            p.index = path.lastComponent.index;
          } else {
            result = this.mainContentContainer.ContentAtPath(path);
            p.container = result.container;
            p.index = -1;
          }
          if (result.obj == null || result.obj == this.mainContentContainer && pathLengthToUse > 0) {
            this.Error("Failed to find content at path '" + path + "', and no approximation of it was possible.");
          } else if (result.approximate)
            this.Warning("Failed to find content at path '" + path + "', so it was approximated to: '" + result.obj.path + "'.");
          return p;
        }
        StateSnapshot() {
          this._stateSnapshotAtLastNewline = this._state;
          this._state = this._state.CopyAndStartPatching();
        }
        RestoreStateSnapshot() {
          if (this._stateSnapshotAtLastNewline === null) {
            NullException_1.throwNullException("_stateSnapshotAtLastNewline");
          }
          this._stateSnapshotAtLastNewline.RestoreAfterPatch();
          this._state = this._stateSnapshotAtLastNewline;
          this._stateSnapshotAtLastNewline = null;
          if (!this._asyncSaving) {
            this._state.ApplyAnyPatch();
          }
        }
        DiscardSnapshot() {
          if (!this._asyncSaving)
            this._state.ApplyAnyPatch();
          this._stateSnapshotAtLastNewline = null;
        }
        CopyStateForBackgroundThreadSave() {
          this.IfAsyncWeCant("start saving on a background thread");
          if (this._asyncSaving)
            throw new Error("Story is already in background saving mode, can't call CopyStateForBackgroundThreadSave again!");
          let stateToSave = this._state;
          this._state = this._state.CopyAndStartPatching();
          this._asyncSaving = true;
          return stateToSave;
        }
        BackgroundSaveComplete() {
          if (this._stateSnapshotAtLastNewline === null) {
            this._state.ApplyAnyPatch();
          }
          this._asyncSaving = false;
        }
        Step() {
          let shouldAddToStream = true;
          let pointer = this.state.currentPointer.copy();
          if (pointer.isNull) {
            return;
          }
          let containerToEnter = TypeAssertion_1.asOrNull(pointer.Resolve(), Container_1.Container);
          while (containerToEnter) {
            this.VisitContainer(containerToEnter, true);
            if (containerToEnter.content.length == 0) {
              break;
            }
            pointer = Pointer_1.Pointer.StartOf(containerToEnter);
            containerToEnter = TypeAssertion_1.asOrNull(pointer.Resolve(), Container_1.Container);
          }
          this.state.currentPointer = pointer.copy();
          if (this._profiler != null)
            this._profiler.Step(this.state.callStack);
          let currentContentObj = pointer.Resolve();
          let isLogicOrFlowControl = this.PerformLogicAndFlowControl(currentContentObj);
          if (this.state.currentPointer.isNull) {
            return;
          }
          if (isLogicOrFlowControl) {
            shouldAddToStream = false;
          }
          let choicePoint = TypeAssertion_1.asOrNull(currentContentObj, ChoicePoint_1.ChoicePoint);
          if (choicePoint) {
            let choice = this.ProcessChoice(choicePoint);
            if (choice) {
              this.state.generatedChoices.push(choice);
            }
            currentContentObj = null;
            shouldAddToStream = false;
          }
          if (currentContentObj instanceof Container_1.Container) {
            shouldAddToStream = false;
          }
          if (shouldAddToStream) {
            let varPointer = TypeAssertion_1.asOrNull(currentContentObj, Value_1.VariablePointerValue);
            if (varPointer && varPointer.contextIndex == -1) {
              let contextIdx = this.state.callStack.ContextForVariableNamed(varPointer.variableName);
              currentContentObj = new Value_1.VariablePointerValue(varPointer.variableName, contextIdx);
            }
            if (this.state.inExpressionEvaluation) {
              this.state.PushEvaluationStack(currentContentObj);
            } else {
              this.state.PushToOutputStream(currentContentObj);
            }
          }
          this.NextContent();
          let controlCmd = TypeAssertion_1.asOrNull(currentContentObj, ControlCommand_1.ControlCommand);
          if (controlCmd && controlCmd.commandType == ControlCommand_1.ControlCommand.CommandType.StartThread) {
            this.state.callStack.PushThread();
          }
        }
        VisitContainer(container, atStart) {
          if (!container.countingAtStartOnly || atStart) {
            if (container.visitsShouldBeCounted)
              this.state.IncrementVisitCountForContainer(container);
            if (container.turnIndexShouldBeCounted)
              this.state.RecordTurnIndexVisitToContainer(container);
          }
        }
        VisitChangedContainersDueToDivert() {
          let previousPointer = this.state.previousPointer.copy();
          let pointer = this.state.currentPointer.copy();
          if (pointer.isNull || pointer.index == -1)
            return;
          this._prevContainers.length = 0;
          if (!previousPointer.isNull) {
            let resolvedPreviousAncestor = previousPointer.Resolve();
            let prevAncestor = TypeAssertion_1.asOrNull(resolvedPreviousAncestor, Container_1.Container) || TypeAssertion_1.asOrNull(previousPointer.container, Container_1.Container);
            while (prevAncestor) {
              this._prevContainers.push(prevAncestor);
              prevAncestor = TypeAssertion_1.asOrNull(prevAncestor.parent, Container_1.Container);
            }
          }
          let currentChildOfContainer = pointer.Resolve();
          if (currentChildOfContainer == null)
            return;
          let currentContainerAncestor = TypeAssertion_1.asOrNull(currentChildOfContainer.parent, Container_1.Container);
          let allChildrenEnteredAtStart = true;
          while (currentContainerAncestor && (this._prevContainers.indexOf(currentContainerAncestor) < 0 || currentContainerAncestor.countingAtStartOnly)) {
            let enteringAtStart = currentContainerAncestor.content.length > 0 && currentChildOfContainer == currentContainerAncestor.content[0] && allChildrenEnteredAtStart;
            if (!enteringAtStart)
              allChildrenEnteredAtStart = false;
            this.VisitContainer(currentContainerAncestor, enteringAtStart);
            currentChildOfContainer = currentContainerAncestor;
            currentContainerAncestor = TypeAssertion_1.asOrNull(currentContainerAncestor.parent, Container_1.Container);
          }
        }
        PopChoiceStringAndTags(tags) {
          let choiceOnlyStrVal = TypeAssertion_1.asOrThrows(this.state.PopEvaluationStack(), Value_1.StringValue);
          while (this.state.evaluationStack.length > 0 && TypeAssertion_1.asOrNull(this.state.PeekEvaluationStack(), Tag_1.Tag) != null) {
            let tag = TypeAssertion_1.asOrNull(this.state.PopEvaluationStack(), Tag_1.Tag);
            if (tag)
              tags.push(tag.text);
          }
          return choiceOnlyStrVal.value;
        }
        ProcessChoice(choicePoint) {
          let showChoice = true;
          if (choicePoint.hasCondition) {
            let conditionValue = this.state.PopEvaluationStack();
            if (!this.IsTruthy(conditionValue)) {
              showChoice = false;
            }
          }
          let startText = "";
          let choiceOnlyText = "";
          let tags = [];
          if (choicePoint.hasChoiceOnlyContent) {
            choiceOnlyText = this.PopChoiceStringAndTags(tags) || "";
          }
          if (choicePoint.hasStartContent) {
            startText = this.PopChoiceStringAndTags(tags) || "";
          }
          if (choicePoint.onceOnly) {
            let visitCount = this.state.VisitCountForContainer(choicePoint.choiceTarget);
            if (visitCount > 0) {
              showChoice = false;
            }
          }
          if (!showChoice) {
            return null;
          }
          let choice = new Choice_1.Choice();
          choice.targetPath = choicePoint.pathOnChoice;
          choice.sourcePath = choicePoint.path.toString();
          choice.isInvisibleDefault = choicePoint.isInvisibleDefault;
          choice.threadAtGeneration = this.state.callStack.ForkThread();
          choice.tags = tags.reverse();
          choice.text = (startText + choiceOnlyText).replace(/^[ \t]+|[ \t]+$/g, "");
          return choice;
        }
        IsTruthy(obj) {
          let truthy = false;
          if (obj instanceof Value_1.Value) {
            let val = obj;
            if (val instanceof Value_1.DivertTargetValue) {
              let divTarget = val;
              this.Error("Shouldn't use a divert target (to " + divTarget.targetPath + ") as a conditional value. Did you intend a function call 'likeThis()' or a read count check 'likeThis'? (no arrows)");
              return false;
            }
            return val.isTruthy;
          }
          return truthy;
        }
        PerformLogicAndFlowControl(contentObj) {
          if (contentObj == null) {
            return false;
          }
          if (contentObj instanceof Divert_1.Divert) {
            let currentDivert = contentObj;
            if (currentDivert.isConditional) {
              let conditionValue = this.state.PopEvaluationStack();
              if (!this.IsTruthy(conditionValue))
                return true;
            }
            if (currentDivert.hasVariableTarget) {
              let varName = currentDivert.variableDivertName;
              let varContents = this.state.variablesState.GetVariableWithName(varName);
              if (varContents == null) {
                this.Error("Tried to divert using a target from a variable that could not be found (" + varName + ")");
              } else if (!(varContents instanceof Value_1.DivertTargetValue)) {
                let intContent = TypeAssertion_1.asOrNull(varContents, Value_1.IntValue);
                let errorMessage = "Tried to divert to a target from a variable, but the variable (" + varName + ") didn't contain a divert target, it ";
                if (intContent instanceof Value_1.IntValue && intContent.value == 0) {
                  errorMessage += "was empty/null (the value 0).";
                } else {
                  errorMessage += "contained '" + varContents + "'.";
                }
                this.Error(errorMessage);
              }
              let target = TypeAssertion_1.asOrThrows(varContents, Value_1.DivertTargetValue);
              this.state.divertedPointer = this.PointerAtPath(target.targetPath);
            } else if (currentDivert.isExternal) {
              this.CallExternalFunction(currentDivert.targetPathString, currentDivert.externalArgs);
              return true;
            } else {
              this.state.divertedPointer = currentDivert.targetPointer.copy();
            }
            if (currentDivert.pushesToStack) {
              this.state.callStack.Push(currentDivert.stackPushType, void 0, this.state.outputStream.length);
            }
            if (this.state.divertedPointer.isNull && !currentDivert.isExternal) {
              if (currentDivert && currentDivert.debugMetadata && currentDivert.debugMetadata.sourceName != null) {
                this.Error("Divert target doesn't exist: " + currentDivert.debugMetadata.sourceName);
              } else {
                this.Error("Divert resolution failed: " + currentDivert);
              }
            }
            return true;
          } else if (contentObj instanceof ControlCommand_1.ControlCommand) {
            let evalCommand = contentObj;
            switch (evalCommand.commandType) {
              case ControlCommand_1.ControlCommand.CommandType.EvalStart:
                this.Assert(this.state.inExpressionEvaluation === false, "Already in expression evaluation?");
                this.state.inExpressionEvaluation = true;
                break;
              case ControlCommand_1.ControlCommand.CommandType.EvalEnd:
                this.Assert(this.state.inExpressionEvaluation === true, "Not in expression evaluation mode");
                this.state.inExpressionEvaluation = false;
                break;
              case ControlCommand_1.ControlCommand.CommandType.EvalOutput:
                if (this.state.evaluationStack.length > 0) {
                  let output = this.state.PopEvaluationStack();
                  if (!(output instanceof Void_1.Void)) {
                    let text = new Value_1.StringValue(output.toString());
                    this.state.PushToOutputStream(text);
                  }
                }
                break;
              case ControlCommand_1.ControlCommand.CommandType.NoOp:
                break;
              case ControlCommand_1.ControlCommand.CommandType.Duplicate:
                this.state.PushEvaluationStack(this.state.PeekEvaluationStack());
                break;
              case ControlCommand_1.ControlCommand.CommandType.PopEvaluatedValue:
                this.state.PopEvaluationStack();
                break;
              case ControlCommand_1.ControlCommand.CommandType.PopFunction:
              case ControlCommand_1.ControlCommand.CommandType.PopTunnel:
                let popType = evalCommand.commandType == ControlCommand_1.ControlCommand.CommandType.PopFunction ? PushPop_1.PushPopType.Function : PushPop_1.PushPopType.Tunnel;
                let overrideTunnelReturnTarget = null;
                if (popType == PushPop_1.PushPopType.Tunnel) {
                  let popped = this.state.PopEvaluationStack();
                  overrideTunnelReturnTarget = TypeAssertion_1.asOrNull(popped, Value_1.DivertTargetValue);
                  if (overrideTunnelReturnTarget === null) {
                    this.Assert(popped instanceof Void_1.Void, "Expected void if ->-> doesn't override target");
                  }
                }
                if (this.state.TryExitFunctionEvaluationFromGame()) {
                  break;
                } else if (this.state.callStack.currentElement.type != popType || !this.state.callStack.canPop) {
                  let names = /* @__PURE__ */ new Map();
                  names.set(PushPop_1.PushPopType.Function, "function return statement (~ return)");
                  names.set(PushPop_1.PushPopType.Tunnel, "tunnel onwards statement (->->)");
                  let expected = names.get(this.state.callStack.currentElement.type);
                  if (!this.state.callStack.canPop) {
                    expected = "end of flow (-> END or choice)";
                  }
                  let errorMsg = "Found " + names.get(popType) + ", when expected " + expected;
                  this.Error(errorMsg);
                } else {
                  this.state.PopCallStack();
                  if (overrideTunnelReturnTarget)
                    this.state.divertedPointer = this.PointerAtPath(overrideTunnelReturnTarget.targetPath);
                }
                break;
              case ControlCommand_1.ControlCommand.CommandType.BeginString:
                this.state.PushToOutputStream(evalCommand);
                this.Assert(this.state.inExpressionEvaluation === true, "Expected to be in an expression when evaluating a string");
                this.state.inExpressionEvaluation = false;
                break;
              case ControlCommand_1.ControlCommand.CommandType.BeginTag:
                this.state.PushToOutputStream(evalCommand);
                break;
              case ControlCommand_1.ControlCommand.CommandType.EndTag: {
                if (this.state.inStringEvaluation) {
                  let contentStackForTag = [];
                  let outputCountConsumed = 0;
                  for (let i = this.state.outputStream.length - 1; i >= 0; --i) {
                    let obj = this.state.outputStream[i];
                    outputCountConsumed++;
                    let command = TypeAssertion_1.asOrNull(obj, ControlCommand_1.ControlCommand);
                    if (command != null) {
                      if (command.commandType == ControlCommand_1.ControlCommand.CommandType.BeginTag) {
                        break;
                      } else {
                        this.Error("Unexpected ControlCommand while extracting tag from choice");
                        break;
                      }
                    }
                    if (obj instanceof Value_1.StringValue) {
                      contentStackForTag.push(obj);
                    }
                  }
                  this.state.PopFromOutputStream(outputCountConsumed);
                  let sb = new StringBuilder_1.StringBuilder();
                  for (let strVal of contentStackForTag) {
                    sb.Append(strVal.toString());
                  }
                  let choiceTag = new Tag_1.Tag(this.state.CleanOutputWhitespace(sb.toString()));
                  this.state.PushEvaluationStack(choiceTag);
                } else {
                  this.state.PushToOutputStream(evalCommand);
                }
                break;
              }
              case ControlCommand_1.ControlCommand.CommandType.EndString: {
                let contentStackForString = [];
                let contentToRetain = [];
                let outputCountConsumed = 0;
                for (let i = this.state.outputStream.length - 1; i >= 0; --i) {
                  let obj = this.state.outputStream[i];
                  outputCountConsumed++;
                  let command = TypeAssertion_1.asOrNull(obj, ControlCommand_1.ControlCommand);
                  if (command && command.commandType == ControlCommand_1.ControlCommand.CommandType.BeginString) {
                    break;
                  }
                  if (obj instanceof Tag_1.Tag) {
                    contentToRetain.push(obj);
                  }
                  if (obj instanceof Value_1.StringValue) {
                    contentStackForString.push(obj);
                  }
                }
                this.state.PopFromOutputStream(outputCountConsumed);
                for (let rescuedTag of contentToRetain)
                  this.state.PushToOutputStream(rescuedTag);
                contentStackForString = contentStackForString.reverse();
                let sb = new StringBuilder_1.StringBuilder();
                for (let c of contentStackForString) {
                  sb.Append(c.toString());
                }
                this.state.inExpressionEvaluation = true;
                this.state.PushEvaluationStack(new Value_1.StringValue(sb.toString()));
                break;
              }
              case ControlCommand_1.ControlCommand.CommandType.ChoiceCount:
                let choiceCount = this.state.generatedChoices.length;
                this.state.PushEvaluationStack(new Value_1.IntValue(choiceCount));
                break;
              case ControlCommand_1.ControlCommand.CommandType.Turns:
                this.state.PushEvaluationStack(new Value_1.IntValue(this.state.currentTurnIndex + 1));
                break;
              case ControlCommand_1.ControlCommand.CommandType.TurnsSince:
              case ControlCommand_1.ControlCommand.CommandType.ReadCount:
                let target = this.state.PopEvaluationStack();
                if (!(target instanceof Value_1.DivertTargetValue)) {
                  let extraNote = "";
                  if (target instanceof Value_1.IntValue)
                    extraNote = ". Did you accidentally pass a read count ('knot_name') instead of a target ('-> knot_name')?";
                  this.Error("TURNS_SINCE / READ_COUNT expected a divert target (knot, stitch, label name), but saw " + target + extraNote);
                  break;
                }
                let divertTarget = TypeAssertion_1.asOrThrows(target, Value_1.DivertTargetValue);
                let container = TypeAssertion_1.asOrNull(this.ContentAtPath(divertTarget.targetPath).correctObj, Container_1.Container);
                let eitherCount;
                if (container != null) {
                  if (evalCommand.commandType == ControlCommand_1.ControlCommand.CommandType.TurnsSince)
                    eitherCount = this.state.TurnsSinceForContainer(container);
                  else
                    eitherCount = this.state.VisitCountForContainer(container);
                } else {
                  if (evalCommand.commandType == ControlCommand_1.ControlCommand.CommandType.TurnsSince)
                    eitherCount = -1;
                  else
                    eitherCount = 0;
                  this.Warning("Failed to find container for " + evalCommand.toString() + " lookup at " + divertTarget.targetPath.toString());
                }
                this.state.PushEvaluationStack(new Value_1.IntValue(eitherCount));
                break;
              case ControlCommand_1.ControlCommand.CommandType.Random: {
                let maxInt = TypeAssertion_1.asOrNull(this.state.PopEvaluationStack(), Value_1.IntValue);
                let minInt = TypeAssertion_1.asOrNull(this.state.PopEvaluationStack(), Value_1.IntValue);
                if (minInt == null || minInt instanceof Value_1.IntValue === false)
                  return this.Error("Invalid value for minimum parameter of RANDOM(min, max)");
                if (maxInt == null || minInt instanceof Value_1.IntValue === false)
                  return this.Error("Invalid value for maximum parameter of RANDOM(min, max)");
                if (maxInt.value === null) {
                  return NullException_1.throwNullException("maxInt.value");
                }
                if (minInt.value === null) {
                  return NullException_1.throwNullException("minInt.value");
                }
                let randomRange = maxInt.value - minInt.value + 1;
                if (!isFinite(randomRange) || randomRange > Number.MAX_SAFE_INTEGER) {
                  randomRange = Number.MAX_SAFE_INTEGER;
                  this.Error("RANDOM was called with a range that exceeds the size that ink numbers can use.");
                }
                if (randomRange <= 0)
                  this.Error("RANDOM was called with minimum as " + minInt.value + " and maximum as " + maxInt.value + ". The maximum must be larger");
                let resultSeed = this.state.storySeed + this.state.previousRandom;
                let random2 = new PRNG_1.PRNG(resultSeed);
                let nextRandom = random2.next();
                let chosenValue = nextRandom % randomRange + minInt.value;
                this.state.PushEvaluationStack(new Value_1.IntValue(chosenValue));
                this.state.previousRandom = nextRandom;
                break;
              }
              case ControlCommand_1.ControlCommand.CommandType.SeedRandom:
                let seed = TypeAssertion_1.asOrNull(this.state.PopEvaluationStack(), Value_1.IntValue);
                if (seed == null || seed instanceof Value_1.IntValue === false)
                  return this.Error("Invalid value passed to SEED_RANDOM");
                if (seed.value === null) {
                  return NullException_1.throwNullException("minInt.value");
                }
                this.state.storySeed = seed.value;
                this.state.previousRandom = 0;
                this.state.PushEvaluationStack(new Void_1.Void());
                break;
              case ControlCommand_1.ControlCommand.CommandType.VisitIndex:
                let count = this.state.VisitCountForContainer(this.state.currentPointer.container) - 1;
                this.state.PushEvaluationStack(new Value_1.IntValue(count));
                break;
              case ControlCommand_1.ControlCommand.CommandType.SequenceShuffleIndex:
                let shuffleIndex = this.NextSequenceShuffleIndex();
                this.state.PushEvaluationStack(new Value_1.IntValue(shuffleIndex));
                break;
              case ControlCommand_1.ControlCommand.CommandType.StartThread:
                break;
              case ControlCommand_1.ControlCommand.CommandType.Done:
                if (this.state.callStack.canPopThread) {
                  this.state.callStack.PopThread();
                } else {
                  this.state.didSafeExit = true;
                  this.state.currentPointer = Pointer_1.Pointer.Null;
                }
                break;
              case ControlCommand_1.ControlCommand.CommandType.End:
                this.state.ForceEnd();
                break;
              case ControlCommand_1.ControlCommand.CommandType.ListFromInt:
                let intVal = TypeAssertion_1.asOrNull(this.state.PopEvaluationStack(), Value_1.IntValue);
                let listNameVal = TypeAssertion_1.asOrThrows(this.state.PopEvaluationStack(), Value_1.StringValue);
                if (intVal === null) {
                  throw new StoryException_1.StoryException("Passed non-integer when creating a list element from a numerical value.");
                }
                let generatedListValue = null;
                if (this.listDefinitions === null) {
                  return NullException_1.throwNullException("this.listDefinitions");
                }
                let foundListDef = this.listDefinitions.TryListGetDefinition(listNameVal.value, null);
                if (foundListDef.exists) {
                  if (intVal.value === null) {
                    return NullException_1.throwNullException("minInt.value");
                  }
                  let foundItem = foundListDef.result.TryGetItemWithValue(intVal.value, InkList_1.InkListItem.Null);
                  if (foundItem.exists) {
                    generatedListValue = new Value_1.ListValue(foundItem.result, intVal.value);
                  }
                } else {
                  throw new StoryException_1.StoryException("Failed to find LIST called " + listNameVal.value);
                }
                if (generatedListValue == null)
                  generatedListValue = new Value_1.ListValue();
                this.state.PushEvaluationStack(generatedListValue);
                break;
              case ControlCommand_1.ControlCommand.CommandType.ListRange:
                let max = TypeAssertion_1.asOrNull(this.state.PopEvaluationStack(), Value_1.Value);
                let min = TypeAssertion_1.asOrNull(this.state.PopEvaluationStack(), Value_1.Value);
                let targetList = TypeAssertion_1.asOrNull(this.state.PopEvaluationStack(), Value_1.ListValue);
                if (targetList === null || min === null || max === null)
                  throw new StoryException_1.StoryException("Expected list, minimum and maximum for LIST_RANGE");
                if (targetList.value === null) {
                  return NullException_1.throwNullException("targetList.value");
                }
                let result = targetList.value.ListWithSubRange(min.valueObject, max.valueObject);
                this.state.PushEvaluationStack(new Value_1.ListValue(result));
                break;
              case ControlCommand_1.ControlCommand.CommandType.ListRandom: {
                let listVal = this.state.PopEvaluationStack();
                if (listVal === null)
                  throw new StoryException_1.StoryException("Expected list for LIST_RANDOM");
                let list = listVal.value;
                let newList = null;
                if (list === null) {
                  throw NullException_1.throwNullException("list");
                }
                if (list.Count == 0) {
                  newList = new InkList_1.InkList();
                } else {
                  let resultSeed = this.state.storySeed + this.state.previousRandom;
                  let random2 = new PRNG_1.PRNG(resultSeed);
                  let nextRandom = random2.next();
                  let listItemIndex = nextRandom % list.Count;
                  let listEnumerator = list.entries();
                  for (let i = 0; i <= listItemIndex - 1; i++) {
                    listEnumerator.next();
                  }
                  let value = listEnumerator.next().value;
                  let randomItem = {
                    Key: InkList_1.InkListItem.fromSerializedKey(value[0]),
                    Value: value[1]
                  };
                  if (randomItem.Key.originName === null) {
                    return NullException_1.throwNullException("randomItem.Key.originName");
                  }
                  newList = new InkList_1.InkList(randomItem.Key.originName, this);
                  newList.Add(randomItem.Key, randomItem.Value);
                  this.state.previousRandom = nextRandom;
                }
                this.state.PushEvaluationStack(new Value_1.ListValue(newList));
                break;
              }
              default:
                this.Error("unhandled ControlCommand: " + evalCommand);
                break;
            }
            return true;
          } else if (contentObj instanceof VariableAssignment_1.VariableAssignment) {
            let varAss = contentObj;
            let assignedVal = this.state.PopEvaluationStack();
            this.state.variablesState.Assign(varAss, assignedVal);
            return true;
          } else if (contentObj instanceof VariableReference_1.VariableReference) {
            let varRef = contentObj;
            let foundValue = null;
            if (varRef.pathForCount != null) {
              let container = varRef.containerForCount;
              let count = this.state.VisitCountForContainer(container);
              foundValue = new Value_1.IntValue(count);
            } else {
              foundValue = this.state.variablesState.GetVariableWithName(varRef.name);
              if (foundValue == null) {
                this.Warning("Variable not found: '" + varRef.name + "'. Using default value of 0 (false). This can happen with temporary variables if the declaration hasn't yet been hit. Globals are always given a default value on load if a value doesn't exist in the save state.");
                foundValue = new Value_1.IntValue(0);
              }
            }
            this.state.PushEvaluationStack(foundValue);
            return true;
          } else if (contentObj instanceof NativeFunctionCall_1.NativeFunctionCall) {
            let func = contentObj;
            let funcParams = this.state.PopEvaluationStack(func.numberOfParameters);
            let result = func.Call(funcParams);
            this.state.PushEvaluationStack(result);
            return true;
          }
          return false;
        }
        ChoosePathString(path, resetCallstack = true, args = []) {
          this.IfAsyncWeCant("call ChoosePathString right now");
          if (this.onChoosePathString !== null)
            this.onChoosePathString(path, args);
          if (resetCallstack) {
            this.ResetCallstack();
          } else {
            if (this.state.callStack.currentElement.type == PushPop_1.PushPopType.Function) {
              let funcDetail = "";
              let container = this.state.callStack.currentElement.currentPointer.container;
              if (container != null) {
                funcDetail = "(" + container.path.toString() + ") ";
              }
              throw new Error("Story was running a function " + funcDetail + "when you called ChoosePathString(" + path + ") - this is almost certainly not not what you want! Full stack trace: \n" + this.state.callStack.callStackTrace);
            }
          }
          this.state.PassArgumentsToEvaluationStack(args);
          this.ChoosePath(new Path_1.Path(path));
        }
        IfAsyncWeCant(activityStr) {
          if (this._asyncContinueActive)
            throw new Error("Can't " + activityStr + ". Story is in the middle of a ContinueAsync(). Make more ContinueAsync() calls or a single Continue() call beforehand.");
        }
        ChoosePath(p, incrementingTurnIndex = true) {
          this.state.SetChosenPath(p, incrementingTurnIndex);
          this.VisitChangedContainersDueToDivert();
        }
        ChooseChoiceIndex(choiceIdx) {
          choiceIdx = choiceIdx;
          let choices = this.currentChoices;
          this.Assert(choiceIdx >= 0 && choiceIdx < choices.length, "choice out of range");
          let choiceToChoose = choices[choiceIdx];
          if (this.onMakeChoice !== null)
            this.onMakeChoice(choiceToChoose);
          if (choiceToChoose.threadAtGeneration === null) {
            return NullException_1.throwNullException("choiceToChoose.threadAtGeneration");
          }
          if (choiceToChoose.targetPath === null) {
            return NullException_1.throwNullException("choiceToChoose.targetPath");
          }
          this.state.callStack.currentThread = choiceToChoose.threadAtGeneration;
          this.ChoosePath(choiceToChoose.targetPath);
        }
        HasFunction(functionName) {
          try {
            return this.KnotContainerWithName(functionName) != null;
          } catch (e) {
            return false;
          }
        }
        EvaluateFunction(functionName, args = [], returnTextOutput = false) {
          if (this.onEvaluateFunction !== null)
            this.onEvaluateFunction(functionName, args);
          this.IfAsyncWeCant("evaluate a function");
          if (functionName == null) {
            throw new Error("Function is null");
          } else if (functionName == "" || functionName.trim() == "") {
            throw new Error("Function is empty or white space.");
          }
          let funcContainer = this.KnotContainerWithName(functionName);
          if (funcContainer == null) {
            throw new Error("Function doesn't exist: '" + functionName + "'");
          }
          let outputStreamBefore = [];
          outputStreamBefore.push(...this.state.outputStream);
          this._state.ResetOutput();
          this.state.StartFunctionEvaluationFromGame(funcContainer, args);
          let stringOutput = new StringBuilder_1.StringBuilder();
          while (this.canContinue) {
            stringOutput.Append(this.Continue());
          }
          let textOutput = stringOutput.toString();
          this._state.ResetOutput(outputStreamBefore);
          let result = this.state.CompleteFunctionEvaluationFromGame();
          if (this.onCompleteEvaluateFunction != null)
            this.onCompleteEvaluateFunction(functionName, args, textOutput, result);
          return returnTextOutput ? { returned: result, output: textOutput } : result;
        }
        EvaluateExpression(exprContainer) {
          let startCallStackHeight = this.state.callStack.elements.length;
          this.state.callStack.Push(PushPop_1.PushPopType.Tunnel);
          this._temporaryEvaluationContainer = exprContainer;
          this.state.GoToStart();
          let evalStackHeight = this.state.evaluationStack.length;
          this.Continue();
          this._temporaryEvaluationContainer = null;
          if (this.state.callStack.elements.length > startCallStackHeight) {
            this.state.PopCallStack();
          }
          let endStackHeight = this.state.evaluationStack.length;
          if (endStackHeight > evalStackHeight) {
            return this.state.PopEvaluationStack();
          } else {
            return null;
          }
        }
        CallExternalFunction(funcName, numberOfArguments) {
          if (funcName === null) {
            return NullException_1.throwNullException("funcName");
          }
          let funcDef = this._externals.get(funcName);
          let fallbackFunctionContainer = null;
          let foundExternal = typeof funcDef !== "undefined";
          if (foundExternal && !funcDef.lookAheadSafe && this._stateSnapshotAtLastNewline !== null) {
            this._sawLookaheadUnsafeFunctionAfterNewline = true;
            return;
          }
          if (!foundExternal) {
            if (this.allowExternalFunctionFallbacks) {
              fallbackFunctionContainer = this.KnotContainerWithName(funcName);
              this.Assert(fallbackFunctionContainer !== null, "Trying to call EXTERNAL function '" + funcName + "' which has not been bound, and fallback ink function could not be found.");
              this.state.callStack.Push(PushPop_1.PushPopType.Function, void 0, this.state.outputStream.length);
              this.state.divertedPointer = Pointer_1.Pointer.StartOf(fallbackFunctionContainer);
              return;
            } else {
              this.Assert(false, "Trying to call EXTERNAL function '" + funcName + "' which has not been bound (and ink fallbacks disabled).");
            }
          }
          let args = [];
          for (let i = 0; i < numberOfArguments; ++i) {
            let poppedObj = TypeAssertion_1.asOrThrows(this.state.PopEvaluationStack(), Value_1.Value);
            let valueObj = poppedObj.valueObject;
            args.push(valueObj);
          }
          args.reverse();
          let funcResult = funcDef.function(args);
          let returnObj = null;
          if (funcResult != null) {
            returnObj = Value_1.Value.Create(funcResult);
            this.Assert(returnObj !== null, "Could not create ink value from returned object of type " + typeof funcResult);
          } else {
            returnObj = new Void_1.Void();
          }
          this.state.PushEvaluationStack(returnObj);
        }
        BindExternalFunctionGeneral(funcName, func, lookaheadSafe = true) {
          this.IfAsyncWeCant("bind an external function");
          this.Assert(!this._externals.has(funcName), "Function '" + funcName + "' has already been bound.");
          this._externals.set(funcName, {
            function: func,
            lookAheadSafe: lookaheadSafe
          });
        }
        TryCoerce(value) {
          return value;
        }
        BindExternalFunction(funcName, func, lookaheadSafe = false) {
          this.Assert(func != null, "Can't bind a null function");
          this.BindExternalFunctionGeneral(funcName, (args) => {
            this.Assert(args.length >= func.length, "External function expected " + func.length + " arguments");
            let coercedArgs = [];
            for (let i = 0, l = args.length; i < l; i++) {
              coercedArgs[i] = this.TryCoerce(args[i]);
            }
            return func.apply(null, coercedArgs);
          }, lookaheadSafe);
        }
        UnbindExternalFunction(funcName) {
          this.IfAsyncWeCant("unbind an external a function");
          this.Assert(this._externals.has(funcName), "Function '" + funcName + "' has not been bound.");
          this._externals.delete(funcName);
        }
        ValidateExternalBindings() {
          let c = null;
          let o = null;
          let missingExternals = arguments[1] || /* @__PURE__ */ new Set();
          if (arguments[0] instanceof Container_1.Container) {
            c = arguments[0];
          }
          if (arguments[0] instanceof Object_1.InkObject) {
            o = arguments[0];
          }
          if (c === null && o === null) {
            this.ValidateExternalBindings(this._mainContentContainer, missingExternals);
            this._hasValidatedExternals = true;
            if (missingExternals.size == 0) {
              this._hasValidatedExternals = true;
            } else {
              let message = "Error: Missing function binding for external";
              message += missingExternals.size > 1 ? "s" : "";
              message += ": '";
              message += Array.from(missingExternals).join("', '");
              message += "' ";
              message += this.allowExternalFunctionFallbacks ? ", and no fallback ink function found." : " (ink fallbacks disabled)";
              this.Error(message);
            }
          } else if (c != null) {
            for (let innerContent of c.content) {
              let container = innerContent;
              if (container == null || !container.hasValidName)
                this.ValidateExternalBindings(innerContent, missingExternals);
            }
            for (let [, value] of c.namedContent) {
              this.ValidateExternalBindings(TypeAssertion_1.asOrNull(value, Object_1.InkObject), missingExternals);
            }
          } else if (o != null) {
            let divert = TypeAssertion_1.asOrNull(o, Divert_1.Divert);
            if (divert && divert.isExternal) {
              let name = divert.targetPathString;
              if (name === null) {
                return NullException_1.throwNullException("name");
              }
              if (!this._externals.has(name)) {
                if (this.allowExternalFunctionFallbacks) {
                  let fallbackFound = this.mainContentContainer.namedContent.has(name);
                  if (!fallbackFound) {
                    missingExternals.add(name);
                  }
                } else {
                  missingExternals.add(name);
                }
              }
            }
          }
        }
        ObserveVariable(variableName, observer) {
          this.IfAsyncWeCant("observe a new variable");
          if (this._variableObservers === null)
            this._variableObservers = /* @__PURE__ */ new Map();
          if (!this.state.variablesState.GlobalVariableExistsWithName(variableName))
            throw new Error("Cannot observe variable '" + variableName + "' because it wasn't declared in the ink story.");
          if (this._variableObservers.has(variableName)) {
            this._variableObservers.get(variableName).push(observer);
          } else {
            this._variableObservers.set(variableName, [observer]);
          }
        }
        ObserveVariables(variableNames, observers) {
          for (let i = 0, l = variableNames.length; i < l; i++) {
            this.ObserveVariable(variableNames[i], observers[i]);
          }
        }
        RemoveVariableObserver(observer, specificVariableName) {
          this.IfAsyncWeCant("remove a variable observer");
          if (this._variableObservers === null)
            return;
          if (specificVariableName != null) {
            if (this._variableObservers.has(specificVariableName)) {
              if (observer != null) {
                let variableObservers = this._variableObservers.get(specificVariableName);
                if (variableObservers != null) {
                  variableObservers.splice(variableObservers.indexOf(observer), 1);
                  if (variableObservers.length === 0) {
                    this._variableObservers.delete(specificVariableName);
                  }
                }
              } else {
                this._variableObservers.delete(specificVariableName);
              }
            }
          } else if (observer != null) {
            let keys = this._variableObservers.keys();
            for (let varName of keys) {
              let variableObservers = this._variableObservers.get(varName);
              if (variableObservers != null) {
                variableObservers.splice(variableObservers.indexOf(observer), 1);
                if (variableObservers.length === 0) {
                  this._variableObservers.delete(varName);
                }
              }
            }
          }
        }
        VariableStateDidChangeEvent(variableName, newValueObj) {
          if (this._variableObservers === null)
            return;
          let observers = this._variableObservers.get(variableName);
          if (typeof observers !== "undefined") {
            if (!(newValueObj instanceof Value_1.Value)) {
              throw new Error("Tried to get the value of a variable that isn't a standard type");
            }
            let val = TypeAssertion_1.asOrThrows(newValueObj, Value_1.Value);
            for (let observer of observers) {
              observer(variableName, val.valueObject);
            }
          }
        }
        get globalTags() {
          return this.TagsAtStartOfFlowContainerWithPathString("");
        }
        TagsForContentAtPath(path) {
          return this.TagsAtStartOfFlowContainerWithPathString(path);
        }
        TagsAtStartOfFlowContainerWithPathString(pathString) {
          let path = new Path_1.Path(pathString);
          let flowContainer = this.ContentAtPath(path).container;
          if (flowContainer === null) {
            return NullException_1.throwNullException("flowContainer");
          }
          while (true) {
            let firstContent = flowContainer.content[0];
            if (firstContent instanceof Container_1.Container)
              flowContainer = firstContent;
            else
              break;
          }
          let inTag = false;
          let tags = null;
          for (let c of flowContainer.content) {
            let command = TypeAssertion_1.asOrNull(c, ControlCommand_1.ControlCommand);
            if (command != null) {
              if (command.commandType == ControlCommand_1.ControlCommand.CommandType.BeginTag) {
                inTag = true;
              } else if (command.commandType == ControlCommand_1.ControlCommand.CommandType.EndTag) {
                inTag = false;
              }
            } else if (inTag) {
              let str = TypeAssertion_1.asOrNull(c, Value_1.StringValue);
              if (str !== null) {
                if (tags === null)
                  tags = [];
                if (str.value !== null)
                  tags.push(str.value);
              } else {
                this.Error("Tag contained non-text content. Only plain text is allowed when using globalTags or TagsAtContentPath. If you want to evaluate dynamic content, you need to use story.Continue().");
              }
            } else {
              break;
            }
          }
          return tags;
        }
        BuildStringOfHierarchy() {
          let sb = new StringBuilder_1.StringBuilder();
          this.mainContentContainer.BuildStringOfHierarchy(sb, 0, this.state.currentPointer.Resolve());
          return sb.toString();
        }
        BuildStringOfContainer(container) {
          let sb = new StringBuilder_1.StringBuilder();
          container.BuildStringOfHierarchy(sb, 0, this.state.currentPointer.Resolve());
          return sb.toString();
        }
        NextContent() {
          this.state.previousPointer = this.state.currentPointer.copy();
          if (!this.state.divertedPointer.isNull) {
            this.state.currentPointer = this.state.divertedPointer.copy();
            this.state.divertedPointer = Pointer_1.Pointer.Null;
            this.VisitChangedContainersDueToDivert();
            if (!this.state.currentPointer.isNull) {
              return;
            }
          }
          let successfulPointerIncrement = this.IncrementContentPointer();
          if (!successfulPointerIncrement) {
            let didPop = false;
            if (this.state.callStack.CanPop(PushPop_1.PushPopType.Function)) {
              this.state.PopCallStack(PushPop_1.PushPopType.Function);
              if (this.state.inExpressionEvaluation) {
                this.state.PushEvaluationStack(new Void_1.Void());
              }
              didPop = true;
            } else if (this.state.callStack.canPopThread) {
              this.state.callStack.PopThread();
              didPop = true;
            } else {
              this.state.TryExitFunctionEvaluationFromGame();
            }
            if (didPop && !this.state.currentPointer.isNull) {
              this.NextContent();
            }
          }
        }
        IncrementContentPointer() {
          let successfulIncrement = true;
          let pointer = this.state.callStack.currentElement.currentPointer.copy();
          pointer.index++;
          if (pointer.container === null) {
            return NullException_1.throwNullException("pointer.container");
          }
          while (pointer.index >= pointer.container.content.length) {
            successfulIncrement = false;
            let nextAncestor = TypeAssertion_1.asOrNull(pointer.container.parent, Container_1.Container);
            if (nextAncestor instanceof Container_1.Container === false) {
              break;
            }
            let indexInAncestor = nextAncestor.content.indexOf(pointer.container);
            if (indexInAncestor == -1) {
              break;
            }
            pointer = new Pointer_1.Pointer(nextAncestor, indexInAncestor);
            pointer.index++;
            successfulIncrement = true;
            if (pointer.container === null) {
              return NullException_1.throwNullException("pointer.container");
            }
          }
          if (!successfulIncrement)
            pointer = Pointer_1.Pointer.Null;
          this.state.callStack.currentElement.currentPointer = pointer.copy();
          return successfulIncrement;
        }
        TryFollowDefaultInvisibleChoice() {
          let allChoices = this._state.currentChoices;
          let invisibleChoices = allChoices.filter((c) => c.isInvisibleDefault);
          if (invisibleChoices.length == 0 || allChoices.length > invisibleChoices.length)
            return false;
          let choice = invisibleChoices[0];
          if (choice.targetPath === null) {
            return NullException_1.throwNullException("choice.targetPath");
          }
          if (choice.threadAtGeneration === null) {
            return NullException_1.throwNullException("choice.threadAtGeneration");
          }
          this.state.callStack.currentThread = choice.threadAtGeneration;
          if (this._stateSnapshotAtLastNewline !== null) {
            this.state.callStack.currentThread = this.state.callStack.ForkThread();
          }
          this.ChoosePath(choice.targetPath, false);
          return true;
        }
        NextSequenceShuffleIndex() {
          let numElementsIntVal = TypeAssertion_1.asOrNull(this.state.PopEvaluationStack(), Value_1.IntValue);
          if (!(numElementsIntVal instanceof Value_1.IntValue)) {
            this.Error("expected number of elements in sequence for shuffle index");
            return 0;
          }
          let seqContainer = this.state.currentPointer.container;
          if (seqContainer === null) {
            return NullException_1.throwNullException("seqContainer");
          }
          if (numElementsIntVal.value === null) {
            return NullException_1.throwNullException("numElementsIntVal.value");
          }
          let numElements = numElementsIntVal.value;
          let seqCountVal = TypeAssertion_1.asOrThrows(this.state.PopEvaluationStack(), Value_1.IntValue);
          let seqCount = seqCountVal.value;
          if (seqCount === null) {
            return NullException_1.throwNullException("seqCount");
          }
          let loopIndex = seqCount / numElements;
          let iterationIndex = seqCount % numElements;
          let seqPathStr = seqContainer.path.toString();
          let sequenceHash = 0;
          for (let i = 0, l = seqPathStr.length; i < l; i++) {
            sequenceHash += seqPathStr.charCodeAt(i) || 0;
          }
          let randomSeed = sequenceHash + loopIndex + this.state.storySeed;
          let random2 = new PRNG_1.PRNG(Math.floor(randomSeed));
          let unpickedIndices = [];
          for (let i = 0; i < numElements; ++i) {
            unpickedIndices.push(i);
          }
          for (let i = 0; i <= iterationIndex; ++i) {
            let chosen = random2.next() % unpickedIndices.length;
            let chosenIndex = unpickedIndices[chosen];
            unpickedIndices.splice(chosen, 1);
            if (i == iterationIndex) {
              return chosenIndex;
            }
          }
          throw new Error("Should never reach here");
        }
        Error(message, useEndLineNumber = false) {
          let e = new StoryException_1.StoryException(message);
          e.useEndLineNumber = useEndLineNumber;
          throw e;
        }
        Warning(message) {
          this.AddError(message, true);
        }
        AddError(message, isWarning = false, useEndLineNumber = false) {
          let dm = this.currentDebugMetadata;
          let errorTypeStr = isWarning ? "WARNING" : "ERROR";
          if (dm != null) {
            let lineNum = useEndLineNumber ? dm.endLineNumber : dm.startLineNumber;
            message = "RUNTIME " + errorTypeStr + ": '" + dm.fileName + "' line " + lineNum + ": " + message;
          } else if (!this.state.currentPointer.isNull) {
            message = "RUNTIME " + errorTypeStr + ": (" + this.state.currentPointer + "): " + message;
          } else {
            message = "RUNTIME " + errorTypeStr + ": " + message;
          }
          this.state.AddError(message, isWarning);
          if (!isWarning)
            this.state.ForceEnd();
        }
        Assert(condition, message = null) {
          if (condition == false) {
            if (message == null) {
              message = "Story assert";
            }
            throw new Error(message + " " + this.currentDebugMetadata);
          }
        }
        get currentDebugMetadata() {
          let dm;
          let pointer = this.state.currentPointer;
          if (!pointer.isNull && pointer.Resolve() !== null) {
            dm = pointer.Resolve().debugMetadata;
            if (dm !== null) {
              return dm;
            }
          }
          for (let i = this.state.callStack.elements.length - 1; i >= 0; --i) {
            pointer = this.state.callStack.elements[i].currentPointer;
            if (!pointer.isNull && pointer.Resolve() !== null) {
              dm = pointer.Resolve().debugMetadata;
              if (dm !== null) {
                return dm;
              }
            }
          }
          for (let i = this.state.outputStream.length - 1; i >= 0; --i) {
            let outputObj = this.state.outputStream[i];
            dm = outputObj.debugMetadata;
            if (dm !== null) {
              return dm;
            }
          }
          return null;
        }
        get mainContentContainer() {
          if (this._temporaryEvaluationContainer) {
            return this._temporaryEvaluationContainer;
          } else {
            return this._mainContentContainer;
          }
        }
      };
      exports.Story = Story2;
      Story2.inkVersionCurrent = 21;
      (function(Story3) {
        let OutputStateChange;
        (function(OutputStateChange2) {
          OutputStateChange2[OutputStateChange2["NoChange"] = 0] = "NoChange";
          OutputStateChange2[OutputStateChange2["ExtendedBeyondNewline"] = 1] = "ExtendedBeyondNewline";
          OutputStateChange2[OutputStateChange2["NewlineRemoved"] = 2] = "NewlineRemoved";
        })(OutputStateChange = Story3.OutputStateChange || (Story3.OutputStateChange = {}));
      })(Story2 = exports.Story || (exports.Story = {}));
    }
  });

  // node_modules/nanoclone/src/index.js
  function clone(src, seen = /* @__PURE__ */ new Map()) {
    if (!src || typeof src !== "object")
      return src;
    if (seen.has(src))
      return seen.get(src);
    let copy;
    if (src.nodeType && "cloneNode" in src) {
      copy = src.cloneNode(true);
      seen.set(src, copy);
    } else if (src instanceof Date) {
      copy = new Date(src.getTime());
      seen.set(src, copy);
    } else if (src instanceof RegExp) {
      copy = new RegExp(src);
      seen.set(src, copy);
    } else if (Array.isArray(src)) {
      copy = new Array(src.length);
      seen.set(src, copy);
      for (let i = 0; i < src.length; i++)
        copy[i] = clone(src[i], seen);
    } else if (src instanceof Map) {
      copy = /* @__PURE__ */ new Map();
      seen.set(src, copy);
      for (const [k, v] of src.entries())
        copy.set(k, clone(v, seen));
    } else if (src instanceof Set) {
      copy = /* @__PURE__ */ new Set();
      seen.set(src, copy);
      for (const v of src)
        copy.add(clone(v, seen));
    } else if (src instanceof Object) {
      copy = {};
      seen.set(src, copy);
      for (const [k, v] of Object.entries(src))
        copy[k] = clone(v, seen);
    } else {
      throw Error(`Unable to clone ${src}`);
    }
    return copy;
  }
  function src_default(src) {
    return clone(src, /* @__PURE__ */ new Map());
  }

  // src/analytics.ts
  var import_gameanalytics = __toESM(require_gameanalytics());

  // src/tools/xyTags.ts
  function xyToTag(pos) {
    if (!pos)
      return "-1_-1";
    return `${pos.x}_${pos.y}`;
  }
  function tagToXy(tag) {
    const [x, y] = tag.split("_");
    return { x: Number(x), y: Number(y) };
  }

  // src/analytics.ts
  var GA = import_gameanalytics.GameAnalytics;
  var gameKey = "0cccc807c1bc3cf03c04c4484781b3e3";
  var secretKey = "e5c1f07cb81d0d2e8c97cfa96d0f068f216b482f";
  var debugAnalytics = true;
  var disableKey = "disableAnalytics";
  var disableValue = "TRUE";
  function isAnalyticsDisabled() {
    return localStorage.getItem(disableKey) === disableValue;
  }
  function startAnalytics() {
    GA.setEnabledInfoLog(debugAnalytics);
    GA.setEnabledVerboseLog(debugAnalytics);
    GA.configureBuild("1.0.0");
    GA.initialize(gameKey, secretKey);
    GA.setEnabledEventSubmission(!isAnalyticsDisabled());
  }
  function sanitise(s) {
    return s.replace(/ /g, "_");
  }
  function startGame(classes2) {
    for (const cn of classes2)
      GA.addDesignEvent(`Game:StartingParty:${sanitise(cn)}`);
  }
  var currentArea = "";
  function startArea(name) {
    currentArea = sanitise(name);
    GA.addProgressionEvent(import_gameanalytics.EGAProgressionStatus.Start, name);
  }
  function partyDied() {
    GA.addProgressionEvent(import_gameanalytics.EGAProgressionStatus.Fail, currentArea, "Floor");
  }
  function startFight(pos, enemies2) {
    GA.addProgressionEvent(
      import_gameanalytics.EGAProgressionStatus.Start,
      currentArea,
      "Fight",
      xyToTag(pos)
    );
    for (const enemy of enemies2)
      GA.addDesignEvent(`Fight:Begin:${sanitise(enemy)}`);
  }
  function winFight(pos) {
    GA.addProgressionEvent(
      import_gameanalytics.EGAProgressionStatus.Complete,
      currentArea,
      "Fight",
      xyToTag(pos)
    );
  }

  // src/tools/isDefined.ts
  function isDefined(item) {
    return typeof item !== "undefined";
  }

  // src/tools/rng.ts
  function random(max) {
    return Math.floor(Math.random() * max);
  }
  function oneOf(items) {
    return items[random(items.length)];
  }
  function pickN(items, count) {
    const left = items.slice();
    if (count >= items.length)
      return left;
    const picked = /* @__PURE__ */ new Set();
    for (let i = 0; i < count; i++) {
      const item = oneOf(left);
      picked.add(item);
      left.splice(left.indexOf(item), 1);
    }
    return Array.from(picked);
  }

  // src/tools/sets.ts
  function intersection(a, b) {
    return a.filter((item) => b.includes(item));
  }

  // src/actions.ts
  var onlyMe = { type: "self" };
  var ally = (count) => ({ type: "ally", count });
  var allAllies = { type: "ally" };
  var oneOpponent = {
    type: "enemy",
    distance: 1,
    count: 1,
    offsets: [0]
  };
  var opponents = (count, offsets) => ({
    type: "enemy",
    distance: 1,
    count,
    offsets
  });
  var generateAttack = (plus = 0, sp = 2) => ({
    name: "Attack",
    tags: ["attack"],
    sp,
    targets: oneOpponent,
    act({ g, targets, me }) {
      const bonus = me.attacksInARow;
      const amount = g.roll(me) + plus + bonus;
      g.applyDamage(me, targets, amount, "hp", "normal");
    }
  });
  var endTurnAction = {
    name: "End Turn",
    tags: [],
    sp: 0,
    targets: allAllies,
    useMessage: "",
    act({ g }) {
      g.endTurn();
    }
  };
  var Barb = {
    name: "Barb",
    tags: ["counter"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Barb",
        duration: 2,
        affects: [me],
        onAfterDamage(e) {
          if (this.affects.includes(e.target)) {
            const targets = [
              g.getOpponent(me, 0),
              g.getOpponent(me, 1),
              g.getOpponent(me, 3)
            ].filter(isDefined);
            if (targets.length) {
              const target = oneOf(targets);
              const amount = g.roll(me);
              g.addToLog(`${e.target.name} flails around!`);
              g.applyDamage(me, [target], amount, "hp", "normal");
            }
          }
        }
      }));
    }
  };
  var Bless = {
    name: "Bless",
    tags: ["heal", "spell"],
    sp: 1,
    targets: ally(1),
    targetFilter: (c) => c.hp < c.maxHP,
    act({ g, me, targets }) {
      for (const target of targets) {
        const amount = Math.max(0, target.camaraderie) + 2;
        g.heal(me, [target], amount);
      }
    }
  };
  var Brace = {
    name: "Brace",
    tags: ["buff"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect((destroy) => ({
        name: "Brace",
        duration: 2,
        affects: [me],
        buff: true,
        onCalculateDamage(e) {
          if (this.affects.includes(e.target)) {
            e.multiplier /= 2;
            destroy();
          }
        }
      }));
    }
  };
  var Bravery = {
    name: "Bravery",
    tags: ["buff"],
    sp: 3,
    targets: allAllies,
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Bravery",
        duration: 2,
        affects: targets,
        buff: true,
        onCalculateDR(e) {
          if (this.affects.includes(e.who))
            e.value += 2;
        }
      }));
    }
  };
  var Deflect = {
    name: "Deflect",
    tags: ["buff"],
    sp: 2,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect((destroy) => ({
        name: "Deflect",
        duration: 2,
        affects: [me],
        onCalculateDamage(e) {
          if (this.affects.includes(e.target)) {
            g.addToLog(`${me.name} deflects the blow.`);
            e.multiplier = 0;
            destroy();
            return;
          }
        }
      }));
    }
  };
  var Defy = {
    name: "Defy",
    tags: ["buff"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Defy",
        duration: 2,
        affects: [me],
        onAfterDamage({ target, attacker }) {
          if (!this.affects.includes(target))
            return;
          g.addToLog(`${me.name} stuns ${attacker.name} with their defiance!`);
          g.addEffect(() => ({
            name: "Defied",
            duration: 1,
            affects: [attacker],
            onCanAct(e) {
              if (this.affects.includes(e.who))
                e.cancel = true;
            }
          }));
        }
      }));
    }
  };
  var DuoStab = {
    name: "DuoStab",
    tags: ["attack"],
    sp: 3,
    targets: opponents(2, [0, 2]),
    act({ g, me, targets }) {
      g.applyDamage(me, targets, 6, "hp", "normal");
    }
  };
  var Flight = {
    name: "Flight",
    tags: ["attack"],
    sp: 4,
    targets: opponents(1, [1, 3]),
    act({ g, me, targets }) {
      const amount = g.roll(me) + 10;
      g.applyDamage(me, targets, amount, "hp", "normal");
    }
  };
  var Parry = {
    name: "Parry",
    tags: ["counter", "buff"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect((destroy) => ({
        name: "Parry",
        duration: 2,
        affects: [me],
        onBeforeAction(e) {
          if (intersection(this.affects, e.targets).length && e.action.tags.includes("attack")) {
            g.addToLog(`${me.name} counters!`);
            const amount = g.roll(me);
            g.applyDamage(me, [e.attacker], amount, "hp", "normal");
            destroy();
            e.cancel = true;
            return;
          }
        }
      }));
    }
  };
  var Sand = {
    name: "Sand",
    tags: ["duff"],
    sp: 3,
    targets: oneOpponent,
    act({ g, me, targets }) {
      g.applyDamage(me, targets, 1, "determination", "normal");
    }
  };
  var Scar = {
    name: "Scar",
    tags: ["attack"],
    sp: 3,
    targets: oneOpponent,
    act({ g, me, targets }) {
      const amount = 4;
      g.applyDamage(me, targets, amount, "hp", "normal");
      g.applyDamage(me, targets, amount, "hp", "normal");
      g.applyDamage(me, targets, amount, "hp", "normal");
    }
  };
  var Trick = {
    name: "Trick",
    tags: ["duff"],
    sp: 3,
    targets: oneOpponent,
    act({ g, me, targets }) {
      g.applyDamage(me, targets, 1, "camaraderie", "normal");
    }
  };

  // src/tools/numbers.ts
  function wrap(n, max) {
    const m = n % max;
    return m < 0 ? m + max : m;
  }

  // src/tools/lists.ts
  function niceList(items) {
    var _a;
    if (items.length === 0)
      return "nobody";
    if (items.length === 1)
      return items[0];
    const firstBunch = items.slice(0, -1);
    const last = (_a = items.at(-1)) != null ? _a : "nobody";
    return `${firstBunch.join(", ")} and ${last}`;
  }
  function pluralS(items) {
    if (items.length === 1)
      return "s";
    return "";
  }

  // src/enemies.ts
  var Lash = {
    name: "Lash",
    tags: ["attack", "duff"],
    sp: 3,
    targets: oneOpponent,
    act({ g, me, targets }) {
      if (g.applyDamage(me, targets, 3, "hp", "normal") > 0) {
        g.addToLog(
          `${niceList(targets.map((x) => x.name))} feel${pluralS(
            targets
          )} temporarily demoralized.`
        );
        g.addEffect(() => ({
          name: "Lash",
          duration: 2,
          affects: targets,
          onCalculateDetermination(e) {
            if (this.affects.includes(e.who))
              e.value--;
          }
        }));
      }
    }
  };
  var EnemyObjects = {
    eNettleSage: 100,
    eEveScout: 110,
    eSneedCrawler: 120,
    eMullanginanMartialist: 130,
    oNettleSage: 100,
    oEveScout: 110,
    oSneedCrawler: 120,
    oMullanginanMartialist: 130
  };
  var enemies = {
    "Eve Scout": {
      object: EnemyObjects.eEveScout,
      animation: { delay: 300, frames: [110, 111, 112, 113] },
      name: "Eve Scout",
      maxHP: 10,
      maxSP: 5,
      camaraderie: 3,
      determination: 3,
      spirit: 4,
      dr: 0,
      actions: [generateAttack(0, 1), Deflect, Sand, Trick]
    },
    "Sneed Crawler": {
      object: EnemyObjects.eSneedCrawler,
      animation: { delay: 300, frames: [120, 121, 122, 123, 124, 125] },
      name: "Sneed Crawler",
      maxHP: 13,
      maxSP: 4,
      camaraderie: 1,
      determination: 5,
      spirit: 4,
      dr: 2,
      actions: [generateAttack(0, 1), Scar, Barb]
    },
    "Mullanginan Martialist": {
      object: EnemyObjects.eMullanginanMartialist,
      animation: { delay: 300, frames: [130, 131, 130, 132] },
      name: "Mullanginan Martialist",
      maxHP: 14,
      maxSP: 4,
      camaraderie: 3,
      determination: 4,
      spirit: 4,
      dr: 1,
      actions: [generateAttack(0, 1), Parry, Defy, Flight]
    },
    "Nettle Sage": {
      object: EnemyObjects.eNettleSage,
      animation: { delay: 300, frames: [100, 101, 100, 102] },
      name: "Nettle Sage",
      maxHP: 12,
      maxSP: 7,
      camaraderie: 2,
      determination: 2,
      spirit: 6,
      dr: 0,
      actions: [generateAttack(0, 1), Bravery, Bless, Lash]
    }
  };
  var EnemyNames = Object.keys(enemies);
  function isEnemyName(name) {
    return EnemyNames.includes(name);
  }
  var Enemy = class {
    constructor(g, template) {
      this.g = g;
      this.template = template;
      this.isPC = false;
      this.animation = template.animation;
      this.frame = 0;
      this.delay = this.animation.delay;
      this.name = template.name;
      this.baseMaxHP = template.maxHP;
      this.baseMaxSP = template.maxSP;
      this.hp = this.maxHP;
      this.sp = this.maxSP;
      this.baseCamaraderie = template.camaraderie;
      this.baseDetermination = template.determination;
      this.baseSpirit = template.spirit;
      this.baseDR = template.dr;
      this.actions = template.actions;
      this.attacksInARow = 0;
      this.usedThisTurn = /* @__PURE__ */ new Set();
    }
    get alive() {
      return this.hp > 0;
    }
    getStat(stat, base) {
      return this.g.applyStatModifiers(this, stat, base);
    }
    get maxHP() {
      return this.getStat("maxHP", this.baseMaxHP);
    }
    get maxSP() {
      return this.getStat("maxHP", this.baseMaxSP);
    }
    get dr() {
      return this.getStat("dr", this.baseDR);
    }
    get camaraderie() {
      return this.getStat("camaraderie", this.baseCamaraderie);
    }
    get determination() {
      return this.getStat("determination", this.baseDetermination);
    }
    get spirit() {
      return this.getStat("spirit", this.baseSpirit);
    }
    advanceAnimation(time) {
      this.delay -= time;
      if (this.delay < 0) {
        this.frame = wrap(this.frame + 1, this.animation.frames.length);
        this.delay += this.animation.delay;
      }
    }
    get object() {
      return this.animation.frames[this.frame];
    }
  };
  function spawn(g, name) {
    return new Enemy(g, enemies[name]);
  }

  // src/tools/shuffle.ts
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // src/types/Dir.ts
  var Dir = /* @__PURE__ */ ((Dir2) => {
    Dir2[Dir2["N"] = 0] = "N";
    Dir2[Dir2["E"] = 1] = "E";
    Dir2[Dir2["S"] = 2] = "S";
    Dir2[Dir2["W"] = 3] = "W";
    return Dir2;
  })(Dir || {});
  var Dir_default = Dir;

  // src/CombatManager.ts
  var CombatManager = class {
    constructor(g, enemyInitialDelay = 3e3, enemyTurnDelay = 1e3, enemyFrameTime = 100) {
      this.g = g;
      this.enemyInitialDelay = enemyInitialDelay;
      this.enemyTurnDelay = enemyTurnDelay;
      this.enemyFrameTime = enemyFrameTime;
      this.end = () => {
        this.resetEnemies();
        this.inCombat = false;
        this.g.draw();
        clearInterval(this.enemyAnimationInterval);
        this.enemyAnimationInterval = void 0;
      };
      this.enemyTick = () => {
        if (!this.inCombat) {
          this.enemyTurnTimeout = void 0;
          return;
        }
        const moves = this.allEnemies.flatMap(
          (enemy2) => enemy2.actions.map((action2) => {
            if (!this.g.canAct(enemy2, action2))
              return;
            const { amount: amount2, possibilities: possibilities2 } = this.g.getTargetPossibilities(
              enemy2,
              action2
            );
            if (possibilities2.length)
              return { enemy: enemy2, action: action2, amount: amount2, possibilities: possibilities2 };
          }).filter(isDefined)
        );
        if (!moves.length) {
          this.enemyTurnTimeout = void 0;
          return this.endTurn();
        }
        const { enemy, action, amount, possibilities } = oneOf(moves);
        const targets = pickN(possibilities, amount);
        this.g.act(enemy, action, targets);
        this.enemyTurnTimeout = setTimeout(this.enemyTick, this.enemyTurnDelay);
      };
      this.onKilled = (c) => {
        if (!c.isPC)
          this.pendingRemoval.push(c);
        else {
          const alive = this.g.party.find((p) => p.alive);
          if (alive)
            return;
          const index = this.g.party.indexOf(c);
          this.g.partyIsDead(index);
        }
      };
      this.onAfterAction = () => {
        for (const e of this.pendingRemoval)
          this.removeEnemy(e);
        this.pendingRemoval = [];
      };
      this.animateEnemies = () => {
        for (const e of this.allEnemies) {
          e.advanceAnimation(this.enemyFrameTime);
        }
        this.g.draw();
      };
      this.effects = [];
      this.resetEnemies();
      this.inCombat = false;
      this.index = 0;
      this.side = "player";
      this.pendingRemoval = [];
      g.eventHandlers.onKilled.add(({ who }) => this.onKilled(who));
      g.eventHandlers.onCombatOver.add(this.end);
      g.eventHandlers.onAfterAction.add(this.onAfterAction);
    }
    resetEnemies() {
      this.enemies = { 0: [], 1: [], 2: [], 3: [] };
    }
    get aliveCombatants() {
      return [
        ...this.g.party,
        ...this.enemies[0],
        ...this.enemies[1],
        ...this.enemies[2],
        ...this.enemies[3]
      ].filter((c) => c.alive);
    }
    get allEnemies() {
      return [
        ...this.enemies[0],
        ...this.enemies[1],
        ...this.enemies[2],
        ...this.enemies[3]
      ];
    }
    begin(enemies2, type) {
      startFight(this.g.position, enemies2);
      for (const e of this.effects.slice())
        if (!e.permanent)
          this.g.removeEffect(e);
      this.resetEnemies();
      const dirs = shuffle([Dir_default.N, Dir_default.E, Dir_default.S, Dir_default.W]);
      let i = 0;
      for (const name of enemies2) {
        const enemy = spawn(this.g, name);
        this.enemies[dirs[i]].push(enemy);
        i = wrap(i + 1, dirs.length);
      }
      for (const c of this.aliveCombatants) {
        c.usedThisTurn.clear();
        c.sp = Math.min(c.spirit, c.maxSP);
      }
      this.inCombat = true;
      this.side = "player";
      this.g.fire("onCombatBegin", { type });
      this.g.draw();
      this.enemyAnimationInterval = setInterval(
        this.animateEnemies,
        this.enemyFrameTime
      );
    }
    getFromOffset(dir, offset) {
      return this.enemies[dir][offset - 1];
    }
    getPosition(c) {
      if (c.isPC)
        return { dir: this.g.party.indexOf(c), distance: -1 };
      for (let dir = 0; dir < 4; dir++) {
        const distance = this.enemies[dir].indexOf(c);
        if (distance >= 0)
          return { dir, distance };
      }
      throw new Error(`${c.name} not found in combat`);
    }
    endTurn() {
      this.side = this.side === "player" ? "enemy" : "player";
      const combatants = this.side === "player" ? this.g.party : this.allEnemies;
      for (const c of combatants) {
        c.usedThisTurn.clear();
        if (!c.alive)
          continue;
        const newSp = c.sp < c.spirit ? c.spirit : c.sp + 1;
        c.sp = Math.min(newSp, c.maxSP);
      }
      for (const e of this.effects.slice()) {
        if (--e.duration < 1)
          this.g.removeEffect(e);
      }
      if (this.side === "enemy")
        this.enemyTurnTimeout = setTimeout(
          this.enemyTick,
          this.enemyInitialDelay
        );
      this.g.draw();
    }
    removeEnemy(e) {
      const { dir, distance } = this.getPosition(e);
      this.enemies[dir].splice(distance, 1);
      this.g.draw();
    }
    checkOver() {
      const alive = this.g.party.find((pc) => pc.alive);
      const winners = alive ? this.allEnemies.length === 0 ? "party" : void 0 : "enemies";
      if (winners) {
        if (alive) {
          this.g.addToLog(`You have vanquished your foes.`);
          winFight(this.g.position);
        } else
          this.g.addToLog(`You have failed.`);
        this.g.fire("onCombatOver", { winners });
      }
    }
  };

  // src/Colours.ts
  var Colours = {
    background: "rgb(32,32,32)",
    logShadow: "rgba(0,0,0,0.4)",
    majorHighlight: "rgb(96,96,64)",
    minorHighlight: "rgb(48,48,32)",
    mapVisited: "rgb(64,64,64)",
    hp: "rgb(223,113,38)",
    sp: "rgb(99,155,255)",
    currentChosenClass: "rgb(255,255,192)",
    currentClass: "rgb(160,160,160)",
    chosenClass: "rgb(192,192,64)",
    otherClass: "rgb(96,96,96)"
  };
  var Colours_default = Colours;

  // src/tools/geometry.ts
  var xy = (x, y) => ({ x, y });
  var xyi = (x, y) => ({
    x: Math.floor(x),
    y: Math.floor(y)
  });
  function sameXY(a, b) {
    return a.x === b.x && a.y === b.y;
  }
  function addXY(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
  }
  var displacements = [xy(0, -1), xy(1, 0), xy(0, 1), xy(-1, 0)];
  function move(pos, dir) {
    return addXY(pos, displacements[dir]);
  }
  function rotate(dir, clockwise) {
    return (dir + clockwise + 4) % 4;
  }
  function dirFromInitial(initial) {
    switch (initial) {
      case "E":
        return Dir_default.E;
      case "S":
        return Dir_default.S;
      case "W":
        return Dir_default.W;
      case "N":
      default:
        return Dir_default.N;
    }
  }
  function getCardinalOffset(start, destination) {
    const dx = destination.x - start.x;
    const dy = destination.y - start.y;
    if (dx && dy)
      return;
    if (dy < 0)
      return { dir: Dir_default.N, offset: -dy };
    if (dx > 0)
      return { dir: Dir_default.E, offset: dx };
    if (dy > 0)
      return { dir: Dir_default.S, offset: dy };
    if (dx < 0)
      return { dir: Dir_default.W, offset: -dx };
  }
  var dirOffsets = {
    [Dir_default.N]: { [Dir_default.N]: 0, [Dir_default.E]: 1, [Dir_default.S]: 2, [Dir_default.W]: 3 },
    [Dir_default.E]: { [Dir_default.N]: 3, [Dir_default.E]: 0, [Dir_default.S]: 1, [Dir_default.W]: 2 },
    [Dir_default.S]: { [Dir_default.N]: 2, [Dir_default.E]: 3, [Dir_default.S]: 0, [Dir_default.W]: 1 },
    [Dir_default.W]: { [Dir_default.N]: 1, [Dir_default.E]: 2, [Dir_default.S]: 3, [Dir_default.W]: 0 }
  };
  function getDirOffset(start, end) {
    return dirOffsets[start][end];
  }
  function lerpXY(from, to, ratio) {
    if (ratio <= 0)
      return from;
    if (ratio >= 1)
      return to;
    const fr = 1 - ratio;
    return xy(from.x * fr + to.x * ratio, from.y * fr + to.y * ratio);
  }

  // src/tools/withTextStyle.ts
  function withTextStyle(ctx, {
    textAlign,
    textBaseline,
    fillStyle,
    fontSize = 10,
    fontFace = "sans-serif",
    globalAlpha = 1
  }) {
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = fillStyle;
    ctx.font = `${fontSize}px ${fontFace}`;
    ctx.globalAlpha = globalAlpha;
    return {
      lineHeight: fontSize + 4,
      measure: (text) => ctx.measureText(text),
      draw: (text, x, y, maxWidth) => ctx.fillText(text, x, y, maxWidth)
    };
  }

  // src/CombatRenderer.ts
  var CombatRenderer = class {
    constructor(g, position = xy(60, 0), size = xy(144, 160), padding = xy(2, 2), rowPadding = 5) {
      this.g = g;
      this.position = position;
      this.size = size;
      this.padding = padding;
      this.rowPadding = rowPadding;
    }
    render() {
      const { padding, position, rowPadding, size } = this;
      const { combat, ctx, facing, party } = this.g;
      const active = combat.side === "player" ? party[facing] : void 0;
      if (active == null ? void 0 : active.alive) {
        ctx.fillStyle = Colours_default.logShadow;
        ctx.fillRect(position.x, position.y, size.x, size.y);
        const { draw, lineHeight } = withTextStyle(ctx, {
          textAlign: "left",
          textBaseline: "middle",
          fillStyle: "white"
        });
        const x = position.x;
        let y = position.y + padding.y + lineHeight / 2;
        draw(`${active.name} has ${active.sp}SP:`, x + padding.x, y);
        y += lineHeight;
        const rowHeight = lineHeight + rowPadding * 2;
        const actions = active.actions;
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          const possible = this.g.canAct(active, action);
          if (i === combat.index) {
            ctx.fillStyle = possible ? Colours_default.majorHighlight : Colours_default.minorHighlight;
            ctx.fillRect(x, y, size.x, rowHeight);
          }
          ctx.fillStyle = possible ? "white" : "silver";
          draw(
            `${action.name} (${action.sp})`,
            x + padding.x,
            y + rowHeight / 2,
            void 0
          );
          y += rowHeight;
        }
      }
    }
  };

  // src/DefaultControls.ts
  var DefaultControls = [
    ["ArrowUp", ["Forward", "MenuUp"]],
    ["KeyW", ["Forward", "MenuUp"]],
    ["ArrowRight", ["TurnRight"]],
    ["KeyE", ["TurnRight"]],
    ["ArrowDown", ["Back", "MenuDown"]],
    ["KeyS", ["Back", "MenuDown"]],
    ["ArrowLeft", ["TurnLeft"]],
    ["KeyQ", ["TurnLeft"]],
    ["Shift+ArrowRight", ["SlideRight"]],
    ["KeyD", ["SlideRight"]],
    ["Shift+ArrowLeft", ["SlideLeft"]],
    ["KeyA", ["SlideLeft"]],
    ["Ctrl+ArrowRight", ["RotateRight"]],
    ["Ctrl+KeyD", ["RotateRight"]],
    ["Ctrl+ArrowLeft", ["RotateLeft"]],
    ["Ctrl+KeyA", ["RotateLeft"]],
    ["Alt+ArrowRight", ["SwapRight"]],
    ["Alt+KeyD", ["SwapRight"]],
    ["Alt+ArrowDown", ["SwapBehind"]],
    ["Alt+KeyS", ["SwapBehind"]],
    ["Alt+ArrowLeft", ["SwapLeft"]],
    ["Alt+KeyA", ["SwapLeft"]],
    ["Space", ["ToggleLog"]],
    ["Enter", ["Interact", "MenuChoose"]],
    ["Return", ["Interact", "MenuChoose"]],
    ["Escape", ["Cancel"]]
  ];
  var DefaultControls_default = DefaultControls;

  // src/tools/getCanvasContext.ts
  function getCanvasContext(canvas, type, options) {
    const ctx = canvas.getContext(type, options);
    if (!ctx)
      throw new Error(`canvas.getContext(${type})`);
    return ctx;
  }

  // src/fov.ts
  var facingDisplacements = {
    [Dir_default.E]: [0, 1, -1, 0],
    [Dir_default.N]: [1, 0, 0, 1],
    [Dir_default.S]: [-1, 0, 0, -1],
    [Dir_default.W]: [0, -1, 1, 0]
  };
  function getDisplacement(from, to, facing) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const [a, b, c, d] = facingDisplacements[facing];
    const x = dx * a + dy * b;
    const y = dx * c + dy * d;
    return [x, y];
  }
  var FovCalculator = class {
    constructor(g) {
      this.g = g;
      this.entries = /* @__PURE__ */ new Map();
    }
    calculate(width, depth) {
      const position = this.g.position;
      this.propagate(position, width, depth);
      return [...this.entries.values()].sort((a, b) => {
        const zd = a.dz - b.dz;
        if (zd)
          return zd;
        const xd = Math.abs(a.dx) - Math.abs(b.dx);
        return -xd;
      });
    }
    displacement(position) {
      return getDisplacement(this.g.position, position, this.g.facing);
    }
    propagate(position, width, depth) {
      if (width <= 0 || depth <= 0)
        return;
      const { g } = this;
      const { facing } = g;
      const tag = xyToTag(position);
      const old = this.entries.get(tag);
      if (old) {
        if (old.width >= width && old.depth >= depth)
          return;
      }
      const { x, y } = position;
      const cell = g.getCell(x, y);
      if (!cell)
        return;
      const [dx, dz] = this.displacement(position);
      const leftVisible = dx <= 0;
      const rightVisible = dx >= 0;
      this.entries.set(tag, {
        x,
        y,
        dx,
        dz,
        width,
        depth,
        leftVisible,
        rightVisible
      });
      if (leftVisible) {
        const leftDir = rotate(facing, 3);
        const leftWall = cell.sides[leftDir];
        if (!(leftWall == null ? void 0 : leftWall.wall))
          this.propagate(move(position, leftDir), width - 1, depth);
      }
      if (rightVisible) {
        const rightDir = rotate(facing, 1);
        const rightWall = cell.sides[rightDir];
        if (!(rightWall == null ? void 0 : rightWall.wall))
          this.propagate(move(position, rightDir), width - 1, depth);
      }
      const forwardWall = cell.sides[facing];
      if (!(forwardWall == null ? void 0 : forwardWall.wall))
        this.propagate(move(position, facing), width, depth - 1);
    }
  };
  function getFieldOfView(g, width, depth) {
    const calc = new FovCalculator(g);
    return calc.calculate(width, depth);
  }

  // src/DungeonRenderer.ts
  var tileTag = (id, type, tile) => `${type}${id}:${tile.x},${tile.z}`;
  var DungeonRenderer = class {
    constructor(g, dungeon, atlasImage, offset = xy(91, 21)) {
      this.g = g;
      this.dungeon = dungeon;
      this.atlasImage = atlasImage;
      this.offset = offset;
      this.imageData = /* @__PURE__ */ new Map();
    }
    addAtlas(layers, image) {
      const atlasCanvas = document.createElement("canvas");
      atlasCanvas.width = image.width;
      atlasCanvas.height = image.height;
      const atlasCtx = getCanvasContext(atlasCanvas, "2d", {
        willReadFrequently: true
      });
      atlasCtx.drawImage(image, 0, 0);
      const promises = [];
      for (const layer of layers) {
        for (const entry of layer.tiles) {
          const imageData = atlasCtx.getImageData(
            entry.coords.x,
            entry.coords.y,
            entry.coords.w,
            entry.coords.h
          );
          const tmpCanvas = document.createElement("canvas");
          tmpCanvas.width = entry.coords.w;
          tmpCanvas.height = entry.coords.h;
          const tmpCtx = getCanvasContext(tmpCanvas, "2d");
          if (entry.flipped) {
            const data = this.flipImage(
              entry.coords.w,
              entry.coords.h,
              imageData.data
            );
            imageData.data.set(data);
          }
          tmpCtx.putImageData(imageData, 0, 0);
          this.imageData.set(tileTag(layer.id, entry.type, entry.tile), entry);
          promises.push(
            createImageBitmap(imageData).then((bmp) => {
              entry.image = bmp;
              return entry;
            })
          );
        }
      }
      return Promise.all(promises);
    }
    getImage(id, type, x, z) {
      const tag = tileTag(id, type, { x, z });
      return this.imageData.get(tag);
    }
    flipImage(w, h, data) {
      const flippedData = new Uint8Array(w * h * 4);
      for (let col = 0; col < w; col++) {
        for (let row = 0; row < h; row++) {
          const index = (w - 1 - col) * 4 + row * w * 4;
          const index2 = col * 4 + row * w * 4;
          flippedData[index2] = data[index];
          flippedData[index2 + 1] = data[index + 1];
          flippedData[index2 + 2] = data[index + 2];
          flippedData[index2 + 3] = data[index + 3];
        }
      }
      return flippedData;
    }
    getLayersOfType(type) {
      return this.dungeon.layers.filter((layer) => layer.type === type);
    }
    project(x, z) {
      const { facing, position } = this.g;
      switch (facing) {
        case Dir_default.N:
          return [position.x + x, position.y + z];
        case Dir_default.E:
          return [position.x - z, position.y + x];
        case Dir_default.S:
          return [position.x - x, position.y - z];
        case Dir_default.W:
          return [position.x + z, position.y - x];
      }
    }
    draw(result) {
      const dx = result.screen.x - (result.flipped ? result.coords.w : 0);
      const dy = result.screen.y;
      this.g.ctx.drawImage(result.image, dx + this.offset.x, dy + this.offset.y);
    }
    drawFront(result, x) {
      const dx = result.screen.x + x * result.coords.fullWidth;
      const dy = result.screen.y;
      this.g.ctx.drawImage(result.image, dx + this.offset.x, dy + this.offset.y);
    }
    drawImage(id, type, x, z) {
      const result = this.getImage(id, type, x, z);
      if (result)
        this.draw(result);
    }
    drawFrontImage(id, type, x, z) {
      const result = this.getImage(id, type, 0, z);
      if (result)
        this.drawFront(result, x);
    }
    render() {
      const rightSide = rotate(this.g.facing, 1);
      const leftSide = rotate(this.g.facing, 3);
      const tiles = getFieldOfView(
        this.g,
        this.dungeon.width,
        this.dungeon.depth
      );
      for (const pos of tiles) {
        const cell = this.g.getCell(pos.x, pos.y);
        if (!cell)
          continue;
        if (cell.ceiling)
          this.drawImage(cell.ceiling, "ceiling", pos.dx, pos.dz);
        if (cell.floor)
          this.drawImage(cell.floor, "floor", pos.dx, pos.dz);
      }
      for (const pos of tiles) {
        const cell = this.g.getCell(pos.x, pos.y);
        if (!cell)
          continue;
        if (pos.leftVisible) {
          const left = cell.sides[leftSide];
          if (left == null ? void 0 : left.wall)
            this.drawImage(left.wall, "side", pos.dx - 1, pos.dz);
          if (left == null ? void 0 : left.decal)
            this.drawImage(left.decal, "side", pos.dx - 1, pos.dz);
        }
        if (pos.rightVisible) {
          const right = cell.sides[rightSide];
          if (right == null ? void 0 : right.wall)
            this.drawImage(right.wall, "side", pos.dx + 1, pos.dz);
          if (right == null ? void 0 : right.decal)
            this.drawImage(right.decal, "side", pos.dx + 1, pos.dz);
        }
        const front = cell.sides[this.g.facing];
        if (front == null ? void 0 : front.wall)
          this.drawFrontImage(front.wall, "front", pos.dx, pos.dz - 1);
        if (front == null ? void 0 : front.decal)
          this.drawFrontImage(front.decal, "front", pos.dx, pos.dz - 1);
        if (cell.object)
          this.drawFrontImage(cell.object, "object", pos.dx, pos.dz);
      }
    }
  };

  // src/tools/getKeyNames.ts
  function getKeyNames(key, shift, alt, ctrl) {
    const names = [key];
    if (shift)
      names.unshift("Shift+" + key);
    if (alt)
      names.unshift("Alt+" + key);
    if (ctrl)
      names.unshift("Ctrl+" + key);
    return names;
  }

  // src/DungeonScreen.ts
  var DungeonScreen = class {
    constructor(g, renderSetup) {
      this.g = g;
      this.renderSetup = renderSetup;
      void g.jukebox.play("explore");
    }
    onKey(e) {
      const keys = getKeyNames(e.code, e.shiftKey, e.altKey, e.ctrlKey);
      for (const key of keys) {
        const input = this.g.controls.get(key);
        if (input) {
          e.preventDefault();
          for (const check of input) {
            if (this.g.processInput(check))
              return;
          }
        }
      }
    }
    render() {
      const { renderSetup } = this;
      const { canvas, ctx, res } = this.g;
      if (!renderSetup) {
        const { draw } = withTextStyle(ctx, {
          textAlign: "center",
          textBaseline: "middle",
          fillStyle: "white"
        });
        draw(
          `Loading: ${res.loaded}/${res.loading}`,
          canvas.width / 2,
          canvas.height / 2
        );
        this.g.draw();
        return;
      }
      renderSetup.dungeon.render();
      renderSetup.hud.render();
      if (this.g.showLog)
        renderSetup.log.render();
      if (this.g.combat.inCombat)
        renderSetup.combat.render();
    }
  };

  // res/hud/base.png
  var base_default = "./base-CLJU2TVL.png";

  // res/hud/buttons.png
  var buttons_default = "./buttons-KWE5CIYP.png";

  // res/hud/map-border.png
  var map_border_default = "./map-border-OU5SS5IH.png";

  // res/hud/marble.png
  var marble_default = "./marble-W57UJINA.png";

  // res/hud/ring.png
  var ring_default = "./ring-H2TENGRF.png";

  // src/StatsRenderer.ts
  var barWidth = 38;
  var coordinates = [
    xy(214, 138),
    xy(274, 180),
    xy(214, 224),
    xy(154, 180)
  ];
  var MarbleAnimator = class {
    constructor(parent, interval = 50, progressTick = 0.2) {
      this.parent = parent;
      this.interval = interval;
      this.progressTick = progressTick;
      this.tick = () => {
        this.parent.g.draw();
        this.progress += this.progressTick;
        if (this.progress >= 1) {
          clearInterval(this.timeout);
          this.timeout = void 0;
        }
        this.parent.positions = this.getPositions();
      };
      this.progress = 0;
      this.swaps = [];
    }
    handle(swaps) {
      if (!this.timeout)
        this.timeout = setInterval(this.tick, this.interval);
      this.swaps = swaps;
      this.progress = 0;
      this.parent.positions = this.getPositions();
    }
    getPositions() {
      const positions = coordinates.slice();
      for (const { from, to } of this.swaps) {
        positions[to] = lerpXY(coordinates[from], coordinates[to], this.progress);
      }
      return positions;
    }
  };
  var StatsRenderer = class {
    constructor(g, text = xy(25, 21), hp = xy(7, 29), sp = xy(7, 35)) {
      this.g = g;
      this.text = text;
      this.hp = hp;
      this.sp = sp;
      this.animator = new MarbleAnimator(this);
      this.spots = [];
      this.positions = coordinates;
      g.eventHandlers.onPartySwap.add((e) => this.animator.handle(e.swaps));
    }
    render(bg) {
      this.spots = [];
      for (let i = 0; i < 4; i++) {
        const xy2 = this.positions[i];
        const pc = this.g.party[i];
        this.renderPC(xy2, pc, bg, i);
      }
    }
    renderPC({ x, y }, pc, bg, index) {
      const { text, hp, sp } = this;
      const { ctx } = this.g;
      this.renderBar(x + hp.x, y + hp.y, pc.hp, pc.maxHP, Colours_default.hp);
      this.renderBar(x + sp.x, y + sp.y, pc.sp, pc.maxSP, Colours_default.sp);
      ctx.globalAlpha = index === this.g.facing ? 1 : 0.7;
      ctx.drawImage(bg, x, y);
      ctx.globalAlpha = 1;
      const { draw } = withTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "white"
      });
      draw(pc.name, x + bg.width / 2, y + text.y, barWidth);
      this.spots.push({
        id: index,
        x,
        y,
        ex: x + bg.width,
        ey: y + bg.height,
        cursor: "pointer"
      });
    }
    spotClicked(spot) {
      this.g.pcClicked(spot.id);
    }
    renderBar(x, y, current, max, colour) {
      const width = Math.floor(
        barWidth * Math.max(0, Math.min(1, current / max))
      );
      this.g.ctx.fillStyle = colour;
      this.g.ctx.fillRect(x, y, width, 3);
    }
  };

  // src/MinimapRenderer.ts
  var facingChars = ["^", ">", "v", "<"];
  var sideColours = {
    "": "white",
    d: "silver",
    s: "grey",
    w: "orange",
    ds: "silver",
    dw: "red",
    sw: "black",
    dsw: "silver"
  };
  function rect(ctx, x, y, ox, oy, w, h, tag) {
    ctx.fillStyle = sideColours[tag];
    ctx.fillRect(x + ox, y + oy, w, h);
  }
  var MinimapRenderer = class {
    constructor(g, tileSize = 16, wallSize = 2, size = xy(2, 2), position = xy(375, 170)) {
      this.g = g;
      this.tileSize = tileSize;
      this.wallSize = wallSize;
      this.size = size;
      this.position = position;
    }
    render() {
      const { tileSize, size, position, wallSize } = this;
      const { ctx, facing, position: partyPos } = this.g;
      const startX = position.x;
      const startY = position.y;
      let dx = 0;
      let dy = startY;
      for (let y = -size.y; y <= size.y; y++) {
        const ty = y + partyPos.y;
        dx = startX - tileSize;
        for (let x = -size.x; x <= size.x; x++) {
          const tx = x + partyPos.x;
          dx += tileSize;
          const { cell, north, east, south, west } = this.g.getMinimapData(
            tx,
            ty
          );
          if (cell) {
            ctx.fillStyle = Colours_default.mapVisited;
            ctx.fillRect(dx, dy, tileSize, tileSize);
          }
          const edge = tileSize - wallSize;
          if (north)
            rect(ctx, dx, dy, 0, 0, tileSize, wallSize, north);
          if (east)
            rect(ctx, dx, dy, edge, 0, wallSize, tileSize, east);
          if (south)
            rect(ctx, dx, dy, 0, edge, tileSize, wallSize, south);
          if (west)
            rect(ctx, dx, dy, 0, 0, wallSize, tileSize, west);
          if (cell == null ? void 0 : cell.object) {
            const { draw: draw2 } = withTextStyle(ctx, {
              textAlign: "center",
              textBaseline: "middle",
              fillStyle: "white",
              fontSize: tileSize
            });
            draw2("\u25CF", dx + tileSize / 2, dy + tileSize / 2);
          }
        }
        dy += tileSize;
      }
      const { draw } = withTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "white"
      });
      draw(
        facingChars[facing],
        startX + tileSize * (size.x + 0.5),
        startY + tileSize * (size.y + 0.5)
      );
    }
  };

  // src/SkillRenderer.ts
  var SkillRenderer = class {
    constructor(g, position = xy(0, 0), offset = xy(20, 42), buttonSize = xy(80, 16), rowHeight = 18) {
      this.g = g;
      this.position = position;
      this.offset = offset;
      this.buttonSize = buttonSize;
      this.rowHeight = rowHeight;
      this.spots = [];
    }
    render() {
      if (this.g.combat.inCombat)
        return;
      const { buttonSize, offset, position, rowHeight } = this;
      const { draw } = withTextStyle(this.g.ctx, {
        textAlign: "left",
        textBaseline: "middle",
        fillStyle: "white"
      });
      const textX = position.x + offset.x;
      let textY = position.y + offset.y;
      for (let id = 0; id < 4; id++) {
        const pc = this.g.party[id];
        if (pc.alive) {
          draw(pc.skill, textX, textY);
          const x = textX - 10;
          const y = textY - 8;
          this.spots.push({
            id,
            x,
            y,
            ex: x + buttonSize.x,
            ey: y + buttonSize.y,
            cursor: "pointer"
          });
        }
        textY += rowHeight;
      }
    }
    spotClicked(spot) {
      this.g.interact(spot.id);
    }
  };

  // src/HUDRenderer.ts
  var empty = document.createElement("img");
  var zero = xyi(0, 0);
  var RollListener = class {
    constructor(g, position = xyi(g.canvas.width / 2, 212), initialDelay = 2e3, fadeDelay = 500) {
      this.g = g;
      this.position = position;
      this.initialDelay = initialDelay;
      this.fadeDelay = fadeDelay;
      this.tick = () => {
        this.opacity = this.opacity > 0.1 ? this.opacity /= 2 : 0;
        this.g.draw();
        this.timer = this.opacity ? setTimeout(this.tick, this.fadeDelay) : void 0;
      };
      this.value = 0;
      this.colour = "white";
      this.opacity = 0;
      this.g.eventHandlers.onRoll.add(
        ({ value, size }) => this.rolled(
          value,
          value === 1 ? "red" : value === size ? "lime" : "white"
        )
      );
    }
    rolled(value, colour) {
      this.value = value;
      this.colour = colour;
      this.opacity = 1;
      if (this.timer)
        clearTimeout(this.timer);
      this.timer = setTimeout(this.tick, this.initialDelay);
      this.g.draw();
    }
    render() {
      if (this.opacity) {
        const { draw } = withTextStyle(this.g.ctx, {
          textAlign: "center",
          textBaseline: "middle",
          fillStyle: this.colour,
          fontSize: 16,
          globalAlpha: this.opacity
        });
        draw(this.value.toString(), this.position.x, this.position.y);
        this.g.ctx.globalAlpha = 1;
      }
    }
  };
  var HUDRenderer = class {
    constructor(g) {
      this.g = g;
      this.images = {
        base: empty,
        buttons: empty,
        mapBorder: empty,
        marble: empty,
        ring: empty
      };
      this.positions = {
        base: zero,
        buttons: zero,
        mapBorder: zero,
        marble: zero,
        ring: zero
      };
      this.stats = new StatsRenderer(g);
      this.minimap = new MinimapRenderer(g);
      this.roll = new RollListener(g);
      this.skills = new SkillRenderer(g);
    }
    acquireImages() {
      return __async(this, null, function* () {
        const [base, buttons, mapBorder, marble, ring] = yield Promise.all([
          this.g.res.loadImage(base_default),
          this.g.res.loadImage(buttons_default),
          this.g.res.loadImage(map_border_default),
          this.g.res.loadImage(marble_default),
          this.g.res.loadImage(ring_default)
        ]);
        const { width, height } = this.g.canvas;
        this.images = { base, buttons, mapBorder, marble, ring };
        this.positions = {
          base: zero,
          buttons: xyi(32, height - buttons.height),
          mapBorder: xyi(width - mapBorder.width, height - mapBorder.height),
          marble: zero,
          // not used
          ring: xyi((width - ring.width) / 2 - 2, height - ring.height)
        };
        this.skills.position = this.positions.buttons;
        return this.images;
      });
    }
    paste(image) {
      const pos = this.positions[image];
      this.g.ctx.drawImage(this.images[image], pos.x, pos.y);
    }
    render() {
      this.paste("base");
      this.paste("ring");
      this.roll.render();
      this.stats.render(this.images.marble);
      this.minimap.render();
      this.paste("mapBorder");
      this.paste("buttons");
      this.skills.render();
    }
  };

  // res/music/footprint-of-the-elephant.ogg
  var footprint_of_the_elephant_default = "./footprint-of-the-elephant-5T73CFK4.ogg";

  // res/music/komfort-zone.ogg
  var komfort_zone_default = "./komfort-zone-3FATGHSQ.ogg";

  // res/music/mod-dot-vigor.ogg
  var mod_dot_vigor_default = "./mod-dot-vigor-KOENWLDQ.ogg";

  // res/music/ringing-steel.ogg
  var ringing_steel_default = "./ringing-steel-T6LCRT3L.ogg";

  // res/music/selume.ogg
  var selume_default = "./selume-YNM3EUW5.ogg";

  // src/Jukebox.ts
  var komfortZone = { name: "komfort zone", url: komfort_zone_default };
  var modDotVigor = {
    name: "mod dot vigor",
    url: mod_dot_vigor_default,
    loop: true
  };
  var ringingSteel = {
    name: "ringing steel",
    url: ringing_steel_default,
    loop: true
  };
  var selume = { name: "selume", url: selume_default };
  var footprintOfTheElephant = {
    name: "footprint of the elephant",
    url: footprint_of_the_elephant_default
  };
  var playlists = {
    title: { tracks: [selume] },
    explore: { tracks: [komfortZone], between: { roll: 20, bonus: 10 } },
    combat: { tracks: [modDotVigor] },
    // FIXME later
    arena: { tracks: [ringingSteel, modDotVigor] },
    death: { tracks: [footprintOfTheElephant] }
  };
  var Jukebox = class {
    constructor(g) {
      this.g = g;
      this.trackEnded = () => {
        const { playlist } = this;
        if (!playlist)
          return;
        if (playlist.between) {
          const delay = random(playlist.between.roll) + playlist.between.bonus;
          if (delay) {
            this.delayTimer = setTimeout(this.next, delay * 1e3);
            return;
          }
        }
        this.next();
      };
      this.next = () => {
        const { index, playlist } = this;
        if (!playlist)
          return;
        this.cancelDelay();
        this.index = wrap(index + 1, playlist.tracks.length);
        void this.start();
      };
      this.tryPlay = () => {
        if (this.wantToPlay) {
          const name = this.wantToPlay;
          this.wantToPlay = void 0;
          void this.play(name).then((success) => {
            if (success) {
              this.g.eventHandlers.onPartyMove.delete(this.tryPlay);
              this.g.eventHandlers.onPartySwap.delete(this.tryPlay);
              this.g.eventHandlers.onPartyTurn.delete(this.tryPlay);
            }
            return success;
          });
        }
      };
      this.index = 0;
      g.eventHandlers.onPartyMove.add(this.tryPlay);
      g.eventHandlers.onPartySwap.add(this.tryPlay);
      g.eventHandlers.onPartyTurn.add(this.tryPlay);
      g.eventHandlers.onCombatBegin.add(
        ({ type }) => void this.play(type === "normal" ? "combat" : "arena")
      );
      g.eventHandlers.onCombatOver.add(
        ({ winners }) => void this.play(winners === "party" ? "explore" : "death")
      );
      for (const pl of Object.values(playlists)) {
        for (const tr of pl.tracks)
          void g.res.loadAudio(tr.url);
      }
    }
    acquire(track) {
      return __async(this, null, function* () {
        if (!track.audio) {
          const audio = yield this.g.res.loadAudio(track.url);
          audio.addEventListener("ended", this.trackEnded);
          track.audio = audio;
          if (track.loop)
            audio.loop = true;
        }
        return track;
      });
    }
    get status() {
      if (this.delayTimer)
        return "between tracks";
      if (!this.playing)
        return "idle";
      return `playing: ${this.playing.name}`;
    }
    cancelDelay() {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = void 0;
      }
    }
    play(p) {
      return __async(this, null, function* () {
        var _a, _b;
        this.cancelDelay();
        this.wantToPlay = p;
        (_b = (_a = this.playing) == null ? void 0 : _a.audio) == null ? void 0 : _b.pause();
        const playlist = playlists[p];
        this.playlist = playlist;
        this.index = random(playlist.tracks.length);
        return this.start();
      });
    }
    start() {
      return __async(this, null, function* () {
        if (!this.playlist)
          return false;
        this.cancelDelay();
        const track = this.playlist.tracks[this.index];
        this.playing = yield this.acquire(track);
        if (!this.playing.audio)
          throw Error(`Acquire ${track.name} failed`);
        try {
          this.playing.audio.currentTime = 0;
          yield this.playing.audio.play();
          this.playing = track;
          this.wantToPlay = void 0;
          return true;
        } catch (e) {
          console.warn(e);
          this.playing = void 0;
          return false;
        }
      });
    }
    stop() {
      if (this.playing) {
        this.playing.audio.pause();
        this.playing = void 0;
      }
    }
  };

  // src/LoadingScreen.ts
  var LoadingScreen = class {
    constructor(g) {
      this.g = g;
      g.draw();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onKey() {
    }
    render() {
      const { canvas, ctx, res } = this.g;
      const { draw } = withTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "white"
      });
      draw(
        `Loading: ${res.loaded}/${res.loading}`,
        canvas.width / 2,
        canvas.height / 2
      );
      this.g.draw();
    }
  };

  // src/tools/textWrap.ts
  function splitWords(s) {
    const words = [];
    let current = "";
    for (const c of s) {
      if (c === " " || c === "\n") {
        words.push(current);
        if (c === "\n")
          words.push("\n");
        current = "";
        continue;
      }
      current += c;
    }
    if (current)
      words.push(current);
    return words;
  }
  function textWrap(source, width, measure) {
    const measurement = measure(source);
    if (measurement.width < width)
      return { lines: source.split("\n"), measurement };
    const words = splitWords(source);
    const lines = [];
    let constructed = "";
    for (const w of words) {
      if (w === "\n") {
        lines.push(constructed);
        constructed = "";
        continue;
      }
      if (!constructed) {
        constructed += w;
        continue;
      }
      const temp = constructed + " " + w;
      const size = measure(temp);
      if (size.width > width) {
        lines.push(constructed);
        constructed = w;
      } else
        constructed += " " + w;
    }
    if (constructed)
      lines.push(constructed);
    return { lines, measurement: measure(source) };
  }

  // src/LogRenderer.ts
  var LogRenderer = class {
    constructor(g, position = xy(276, 0), size = xy(204, 270), padding = xy(2, 2)) {
      this.g = g;
      this.position = position;
      this.size = size;
      this.padding = padding;
    }
    render() {
      const { padding, position, size } = this;
      const { ctx, log } = this.g;
      ctx.fillStyle = Colours_default.logShadow;
      ctx.fillRect(position.x, position.y, size.x, size.y);
      const width = size.x - padding.x * 2;
      const textX = position.x + padding.x;
      let textY = position.y + size.y - padding.y;
      const { lineHeight, measure, draw } = withTextStyle(ctx, {
        textAlign: "left",
        textBaseline: "bottom",
        fillStyle: "white"
      });
      for (let i = log.length - 1; i >= 0; i--) {
        const { lines } = textWrap(log[i], width, measure);
        for (const line of lines.reverse()) {
          draw(line, textX, textY);
          textY = textY - lineHeight;
          if (textY < position.y)
            return;
        }
      }
    }
  };

  // src/ResourceManager.ts
  var ResourceManager = class {
    constructor() {
      this.promises = /* @__PURE__ */ new Map();
      this.loaders = [];
      this.atlases = {};
      this.audio = {};
      this.images = {};
      this.maps = {};
      this.scripts = {};
      this.loaded = 0;
      this.loading = 0;
    }
    start(src, promise) {
      this.loading++;
      this.promises.set(src, promise);
      this.loaders.push(
        promise.then((arg) => {
          this.loaded++;
          return arg;
        })
      );
      return promise;
    }
    loadImage(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.addEventListener("load", () => {
            this.images[src] = img;
            resolve(img);
          });
        })
      );
    }
    loadAtlas(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        fetch(src).then((r) => r.json()).then((atlas) => {
          this.atlases[src] = atlas;
          return atlas;
        })
      );
    }
    loadGCMap(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        fetch(src).then((r) => r.json()).then((map) => {
          this.maps[src] = map;
          return map;
        })
      );
    }
    loadScript(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        fetch(src).then((r) => r.text()).then((script) => {
          this.scripts[src] = script;
          return script;
        })
      );
    }
    loadAudio(src) {
      const res = this.promises.get(src);
      if (res)
        return res;
      return this.start(
        src,
        new Promise((resolve) => {
          const audio = new Audio();
          audio.src = src;
          audio.addEventListener("canplaythrough", () => {
            this.audio[src] = audio;
            resolve(audio);
          });
        })
      );
    }
  };

  // src/Soon.ts
  var Soon = class {
    constructor(callback) {
      this.callback = callback;
      this.call = () => {
        this.timeout = void 0;
        this.callback();
      };
    }
    schedule() {
      if (!this.timeout)
        this.timeout = requestAnimationFrame(this.call);
    }
  };

  // res/sad-folks.png
  var sad_folks_default = "./sad-folks-WT2RUZAU.png";

  // src/types/ClassName.ts
  var ClassNames = [
    "Martialist",
    "Cleavesman",
    "Far Scout",
    "War Caller",
    "Flag Singer",
    "Loam Seer"
  ];

  // src/EngineInkScripting.ts
  var import_Story = __toESM(require_Story());

  // src/items/cleavesman.ts
  var cleavesman_exports = {};
  __export(cleavesman_exports, {
    ChivalrousMantle: () => ChivalrousMantle,
    Gambesar: () => Gambesar,
    GorgothilSword: () => GorgothilSword,
    Gullark: () => Gullark,
    Haringplate: () => Haringplate,
    Jaegerstock: () => Jaegerstock,
    Varganglia: () => Varganglia
  });
  var GorgothilSword = {
    name: "Gorgothil Sword",
    restrict: ["Cleavesman"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: {
      name: "Bash",
      tags: ["attack"],
      sp: 1,
      targets: oneOpponent,
      act({ g, me, targets }) {
        const amount = g.roll(me) + 4;
        g.applyDamage(me, targets, amount, "hp", "normal");
      }
    }
  };
  var Haringplate = {
    name: "Haringplate",
    restrict: ["Cleavesman"],
    slot: "Body",
    type: "Armour",
    bonus: { maxHP: 5 },
    action: Brace
  };
  var Gullark = {
    name: "Gullark",
    restrict: ["Cleavesman"],
    slot: "Hand",
    type: "Shield",
    bonus: { maxHP: 3 },
    action: Deflect
  };
  var Jaegerstock = {
    name: "Jaegerstock",
    restrict: ["Cleavesman"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: DuoStab
  };
  var Varganglia = {
    name: "Varganglia",
    restrict: ["Cleavesman"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: Barb
  };
  var Gambesar = {
    name: "Gambesar",
    restrict: ["Cleavesman"],
    slot: "Body",
    type: "Armour",
    bonus: { maxHP: 5 },
    action: {
      name: "Tackle",
      tags: ["attack"],
      sp: 3,
      targets: opponents(1, [1, 3]),
      act({ g, me, targets }) {
        const amount = g.roll(me);
        g.applyDamage(me, targets, amount, "hp", "normal");
      }
    }
  };
  var ChivalrousMantle = {
    name: "Chivalrous Mantle",
    restrict: ["Cleavesman"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Honour",
      tags: [],
      sp: 2,
      targets: allAllies,
      act({ g, targets }) {
        g.addEffect(() => ({
          name: "Honour",
          duration: 2,
          affects: targets,
          buff: true,
          onCalculateDamage(e) {
            if (this.affects.includes(e.target) && e.type === "determination")
              e.multiplier = 0;
          }
        }));
      }
    }
  };
  GorgothilSword.lore = `"""May this steel sing the color of heathen blood.""

This phrase has been uttered ever since Gorgothil was liberated from the thralls of Mullanginan during the Lost War. Gorgothil is now an ever devoted ally, paying their debts by smithing weaponry for all cleavesmen under Cherraphy's wing."`;
  Gullark.lore = `Dredged from the Furnace of Ogkh, gullarks are formerly the shells belonging to an ancient creature called a Crim; egg shaped quadrupeds with the face of someone screaming in torment. Many believe their extinction is owed to the over-production of gullarks during the Lost War.`;
  Jaegerstock.lore = `Able to stab in a forward and back motion, then a back to forward motion, and once again in a forward and back motion. Wielders often put one foot forward to brace themselves, and those with transcendental minds? They also stab in a forward and back motion.`;
  Varganglia.lore = `Armour that's slithered forth from Telnoth's scars after the Long War ended. Varganglia carcasses have become a common attire for cleavesmen, their pelts covered with thick and venomous barbs that erupt from the carcass when struck, making the wearer difficult to strike.`;
  Gambesar.lore = `"Enchanted by Cherraphy's highest order of sages, gambesars are awarded only to cleavesman that return from battle after sustaining tremendous injury. It's said that wearing one allows the user to shift the environment around them, appearing multiple steps from where they first started in just an instant.`;

  // src/items/farScout.ts
  var farScout_exports = {};
  __export(farScout_exports, {
    AdaloaxPelt: () => AdaloaxPelt,
    BoltSlinger: () => BoltSlinger,
    Haversack: () => Haversack,
    PryingPoleaxe: () => PryingPoleaxe
  });
  var BoltSlinger = {
    name: "Bolt Slinger",
    restrict: ["Far Scout"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: {
      name: "Arrow",
      tags: ["attack"],
      sp: 3,
      targets: opponents(1, [1, 2, 3]),
      act({ g, me, targets }) {
        const amount = g.roll(me) + 2;
        g.applyDamage(me, targets, amount, "hp", "normal");
      }
    }
  };
  var AdaloaxPelt = {
    name: "Adaloax Pelt",
    restrict: ["Far Scout"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: {
      name: "Bind",
      tags: ["duff"],
      sp: 4,
      targets: oneOpponent,
      act({ g, targets }) {
        g.addToLog(`${niceList(targets.map((x) => x.name))} is bound tightly!`);
        g.addEffect(() => ({
          name: "Bind",
          duration: 2,
          affects: targets,
          onCanAct(e) {
            if (this.affects.includes(e.who))
              e.cancel = true;
          }
        }));
      }
    }
  };
  var Haversack = {
    name: "Haversack",
    restrict: ["Far Scout"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: Sand
  };
  var PryingPoleaxe = {
    name: "Prying Poleaxe",
    restrict: ["Far Scout"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: {
      name: "Gouge",
      tags: ["attack", "duff"],
      sp: 5,
      targets: oneOpponent,
      act({ g, me, targets }) {
        const amount = g.roll(me) + 6;
        if (g.applyDamage(me, targets, amount, "hp", "normal") > 0) {
          g.addEffect(() => ({
            name: "Gouge",
            duration: 2,
            affects: targets,
            onCalculateDR(e) {
              if (this.affects.includes(e.who))
                e.multiplier = 0;
            }
          }));
        }
      }
    }
  };
  BoltSlinger.lore = `A string and stick combo coming in many shapes and sizes. All with the express purpose of expelling sharp objects at blinding speeds. Any far scout worth their salt still opts for a retro-styled bolt slinger; clunky mechanisms and needless gadgets serve only to hinder one's own skills.`;
  AdaloaxPelt.lore = `Traditional hunter-gatherer and scouting attire, adaloax pelts are often sold and coupled with a set of bolas for trapping prey. The rest of the adaloax is divided up into portions of meat and sold at market value, often a single adaloax can produce upwards of three pelts and enough meat to keep multiple people fed.`;
  Haversack.lore = `People, creatures, automata and constructs of all kinds find different use for a haversack, but the sand pouch remains the same. Considered a coward's weapon by many, the remainder would disagree as sometimes flight is the only response to a fight. A hasty retreat is far more preferable than a future as carrion.`;

  // src/items/flagSinger.ts
  var flagSinger_exports = {};
  __export(flagSinger_exports, {
    CarvingKnife: () => CarvingKnife,
    CatFacedMasquerade: () => CatFacedMasquerade,
    DivaDress: () => DivaDress,
    Fandagger: () => Fandagger,
    FolkHarp: () => FolkHarp,
    GrowlingCollar: () => GrowlingCollar,
    SignedCasque: () => SignedCasque,
    Storyscroll: () => Storyscroll,
    WindmillRobe: () => WindmillRobe
  });
  var CarvingKnife = {
    name: "Carving Knife",
    restrict: ["Flag Singer"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: Scar
  };
  var SignedCasque = {
    name: "Signed Casque",
    restrict: ["Flag Singer"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: {
      name: "Cheer",
      tags: ["buff"],
      sp: 2,
      targets: ally(1),
      act({ g, targets }) {
        g.addToLog(
          `${niceList(targets.map((x) => x.name))} feel${pluralS(
            targets
          )} more protected.`
        );
        g.addEffect(() => ({
          name: "Cheer",
          duration: 2,
          affects: targets,
          buff: true,
          onCalculateDR(e) {
            if (this.affects.includes(e.who))
              e.value += 3;
          }
        }));
      }
    }
  };
  var Fandagger = {
    name: "Fandagger",
    restrict: ["Flag Singer"],
    slot: "Hand",
    type: "Flag",
    bonus: {},
    action: {
      name: "Conduct",
      tags: ["attack"],
      sp: 3,
      targets: oneOpponent,
      act({ g, me, targets }) {
        const dealt = g.applyDamage(me, targets, 6, "hp", "normal");
        if (dealt > 0) {
          const ally2 = oneOf(g.getAllies(me, false));
          if (ally2) {
            g.addToLog(`${me.name} conducts ${ally2.name}'s next attack.`);
            g.addEffect((destroy) => ({
              name: "Conduct",
              duration: 1,
              affects: [ally2],
              buff: true,
              onCalculateDamage(e) {
                if (this.affects.includes(e.attacker)) {
                  const bonus = g.roll(me);
                  e.amount += bonus;
                  destroy();
                }
              }
            }));
          }
        }
      }
    }
  };
  var Storyscroll = {
    name: "Storyscroll",
    restrict: ["Flag Singer"],
    slot: "Hand",
    type: "Flag",
    bonus: { spirit: 1 },
    action: Bravery
  };
  var DivaDress = {
    name: "Diva's Dress",
    restrict: ["Flag Singer"],
    slot: "Body",
    type: "Armour",
    bonus: { spirit: 1 },
    action: Defy
  };
  var GrowlingCollar = {
    name: "Growling Collar",
    restrict: ["Flag Singer"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: {
      name: "Vox Pop",
      tags: ["duff"],
      sp: 4,
      targets: allAllies,
      act({ g, me, targets }) {
        g.addEffect(() => ({
          name: "Vox Pop",
          duration: 2,
          affects: targets,
          buff: true,
          onCalculateDR(e) {
            if (this.affects.includes(e.who))
              e.value += 2;
          }
        }));
        const opponent = g.getOpponent(me);
        if (opponent) {
          const effects = g.getEffectsOn(opponent).filter((e) => e.buff);
          if (effects.length) {
            g.addToLog(`${opponent.name} loses their protections.`);
            g.removeEffectsFrom(effects, opponent);
            g.applyDamage(me, [opponent], g.roll(me), "hp", "normal");
          }
        }
      }
    }
  };
  var FolkHarp = {
    name: "Folk Harp",
    restrict: ["Flag Singer"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Muse",
      tags: ["buff"],
      sp: 2,
      targets: allAllies,
      act({ g, targets }) {
        g.addEffect(() => ({
          name: "Muse",
          duration: 2,
          affects: targets,
          onCalculateDamage(e) {
            if (this.affects.includes(e.attacker))
              e.amount += e.attacker.camaraderie;
          }
        }));
      }
    }
  };
  var CatFacedMasquerade = {
    name: "Cat-faced Masquerade",
    restrict: ["Flag Singer"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Inspire",
      tags: ["buff"],
      sp: 4,
      targets: allAllies,
      act({ g, me, targets }) {
        g.addEffect(() => ({
          name: "Inspire",
          duration: 2,
          affects: targets,
          onCalculateDamage(e) {
            if (this.affects.includes(e.target)) {
              e.multiplier = 0;
              g.addToLog(`${e.attacker.name} faces backlash!`);
              g.applyDamage(me, [e.attacker], g.roll(me), "hp", "magic");
            }
          }
        }));
      }
    }
  };
  var WindmillRobe = {
    name: "Windmill Robe",
    restrict: ["Flag Singer"],
    slot: "Special",
    bonus: { dr: 1 },
    action: {
      name: "Unveil",
      tags: [],
      sp: 1,
      targets: oneOpponent,
      act() {
      }
    }
  };
  CarvingKnife.lore = `Not a martial weapon, but rather a craftsman and artist's tool. Having secretly spurned Cherraphy's foul request, this Singer carries this knife as a confirmation that what they did was right.`;
  SignedCasque.lore = `A vest made of traditional plaster and adorned in writing with the feelings and wishes of each villager the Singer dares to protect.`;
  Fandagger.lore = `Fandaggers are graceful tools of the rogue, to be danced with and to be thrown between acrobats in relay. Held at one end they concertina into painted fans; the other suits the stabbing grip.`;
  Storyscroll.lore = `A furled tapestry illustrated with a brief history of Haringlee myth. When the Flag Singer whirls it about them as though dancing with ribbons, their comrades are enriched by the spirit of the fantasies it depicts.`;
  DivaDress.lore = `Few dare interfere with the performance of a Singer so dressed: these glittering magic garments dazzle any foolish enough to try! All may wear the Diva's Dress so long as it is earned by skill; gender matters not to the craft.`;
  GrowlingCollar.lore = `A mechanical amplifier pressed tightly to the skin of the throat, held in place by a black leather collar. When you speak, it roars.`;
  FolkHarp.lore = `An ancient traditional instrument, strings of animal innards sprung over a tune-measured wooden frame to create a playable musical scale. Can be plucked melodically, or strummed to produce a glistening, harmonic, rain-like sound.`;
  CatFacedMasquerade.lore = `A mask that lends its wearer a mocking air, or one of being deeply unimpressed. Turning this disdainful expression on an enemy reassures your allies of their superiority; a simple means of encouragement in complicated times.`;
  WindmillRobe.lore = `A pale blue robe with ultra-long sleeves, slung with diamond-shaped hanging sheets of fabric. Psychic expertise and practise allows you to manipulate these flags and perform intricate displays without so much as moving your arms; the most complicated dances can have a mesmerizing effect.`;

  // src/items/loamSeer.ts
  var loamSeer_exports = {};
  __export(loamSeer_exports, {
    BeekeeperBrooch: () => BeekeeperBrooch,
    Cornucopia: () => Cornucopia,
    IoliteCross: () => IoliteCross,
    JacketAndRucksack: () => JacketAndRucksack,
    MantleOfClay: () => MantleOfClay,
    Mosscloak: () => Mosscloak,
    RockringSleeve: () => RockringSleeve,
    TortoiseFamiliar: () => TortoiseFamiliar,
    WandOfWorkedFlint: () => WandOfWorkedFlint
  });
  var Cornucopia = {
    name: "Cornucopia",
    restrict: ["Loam Seer"],
    slot: "Hand",
    type: "Catalyst",
    bonus: {},
    action: Bless
  };
  var JacketAndRucksack = {
    name: "Jacket and Rucksack",
    restrict: ["Loam Seer"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: {
      name: "Observe",
      tags: [],
      sp: 4,
      targets: oneOpponent,
      act({ g, targets }) {
        g.addToLog(
          `${niceList(targets.map((x) => x.name))} has nowhere to hide!`
        );
        g.addEffect(() => ({
          name: "Observe",
          duration: 2,
          affects: targets,
          onCalculateDR(e) {
            if (this.affects.includes(e.who))
              e.value--;
          }
        }));
      }
    }
  };
  var IoliteCross = {
    name: "Iolite Cross",
    restrict: ["Loam Seer"],
    slot: "Hand",
    type: "Catalyst",
    bonus: { spirit: 1 },
    action: {
      name: "Vanish",
      tags: ["movement"],
      sp: 2,
      targets: onlyMe,
      act() {
      }
    }
  };
  var BeekeeperBrooch = {
    name: "Beekeeper's Brooch of Needling",
    restrict: ["Loam Seer"],
    slot: "Hand",
    type: "Catalyst",
    bonus: {},
    action: {
      name: "Swarm",
      tags: ["attack", "spell"],
      sp: 2,
      targets: opponents(3, [0, 1, 3]),
      act({ g, me, targets }) {
        g.applyDamage(me, targets, 3, "hp", "magic");
      }
    }
  };
  var RockringSleeve = {
    name: "Rockring Sleeve",
    restrict: ["Loam Seer"],
    slot: "Body",
    type: "Armour",
    bonus: { dr: 2 },
    action: Bravery
  };
  var Mosscloak = {
    name: "Mosscloak",
    restrict: ["Loam Seer"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: {
      name: "Study",
      tags: [],
      sp: 1,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect(() => ({
          name: "Study",
          duration: 2,
          affects: [me],
          onAfterDamage({ target, type }) {
            if (this.affects.includes(target) && type === "hp")
              target.sp = Math.min(target.sp + 2, target.maxSP);
          }
        }));
      }
    }
  };
  var WandOfWorkedFlint = {
    name: "Wand of Worked Flint",
    restrict: ["Loam Seer"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Crackle",
      tags: ["attack", "spell"],
      sp: 2,
      x: true,
      targets: { type: "enemy" },
      act({ g, me, targets, x }) {
        for (let i = 0; i < x; i++) {
          const alive = targets.filter((t) => t.alive);
          if (!alive.length)
            return;
          const target = oneOf(alive);
          const amount = g.roll(me) + 2;
          g.applyDamage(me, [target], amount, "hp", "magic");
        }
      }
    }
  };
  var TortoiseFamiliar = {
    name: "Tortoise Familiar",
    restrict: ["Loam Seer"],
    slot: "Special",
    bonus: { camaraderie: 1 },
    action: {
      name: "Reforge",
      tags: ["heal", "spell"],
      sp: 5,
      targets: onlyMe,
      act({ g, me }) {
        g.heal(me, [me], Infinity);
      }
    }
  };
  var MantleOfClay = {
    name: "Mantle of Clay",
    restrict: ["Loam Seer"],
    slot: "Special",
    bonus: { dr: 1 },
    action: {
      name: "Rumble",
      tags: ["attack", "spell"],
      sp: 4,
      targets: opponents(),
      act({ g, me }) {
        const amount = g.roll(me) + 10;
        const opponent = g.getOpponent(me);
        const others = [
          g.getOpponent(me, 1),
          g.getOpponent(me, 2),
          g.getOpponent(me, 3)
        ].filter(isDefined);
        const targets = [opponent, oneOf(others)].filter(isDefined);
        g.applyDamage(me, targets, amount, "hp", "magic");
        g.applyDamage(me, targets, 1, "spirit", "magic");
      }
    }
  };
  Cornucopia.lore = `The proverbial horn of plenty, or rather a replica crafted by the artists of Haringlee, then bestowed by its priests with a magickal knack for exuding a sweet restorative nectar.`;
  JacketAndRucksack.lore = `Clothes and containers of simple leather. Sensible wear for foragers and druidic types; not truly intended for fighting.`;
  IoliteCross.lore = `A semi-precious crux. Light generated by uncanny phosphorous plants - or by the setting sun - hits this substance at a remarkable, almost magickal angle.`;
  BeekeeperBrooch.lore = `The badge of office for any who ally with insectkind. Bids fierce clouds of bees to deliver a salvo of stings to the assailants of one truly in harmony with the earth, if they are humble and bereft of secret ambition.`;
  RockringSleeve.lore = `A set of four polished hoops of granite, fit to mold closely to its wearer's forearm. Studied practitioners of the power that dwells within rock can share the protection of such a carapace with their compatriots.`;
  Mosscloak.lore = `Deep into the wilderness where wood meets river, a type of silver-grey-green moss flourishes that piles on so thick that, when carefully detached from the tree trunk it hugs, can retain its integrity as a naturally-occurring fabric. This specimen reaches all the way from shoulder to foot and trails some length along the ground behind you!`;
  WandOfWorkedFlint.lore = `A spike of sparking rock, decorated with one twisting groove from haft to tip. Rubbing your thumb along the thing produces a faint sizzling sound.`;
  TortoiseFamiliar.lore = `The tortoise is one of the ground's favoured children, fashioned in its image. This one seems to have an interest in your cause.`;
  MantleOfClay.lore = `Pots of runny clay, into which fingers and paintbrushes can be dipped. It grips the skin tight as any tattoo when applied in certain patterns, like veins; so too can the shaman who wears these marks espy the "veins" of the rocks below them and, with a tug, bid them tremble.`;

  // src/items/martialist.ts
  var martialist_exports = {};
  __export(martialist_exports, {
    Halberdigan: () => Halberdigan,
    HalflightCowl: () => HalflightCowl,
    HaringleeKasaya: () => HaringleeKasaya,
    KhakkharaOfGhanju: () => KhakkharaOfGhanju,
    LastEyeOfRaong: () => LastEyeOfRaong,
    LoromayHand: () => LoromayHand,
    NundarialVestments: () => NundarialVestments,
    Penduchaimmer: () => Penduchaimmer,
    YamorolMouth: () => YamorolMouth
  });
  var Penduchaimmer = {
    name: "Penduchaimmer",
    restrict: ["Martialist"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: DuoStab
  };
  var HaringleeKasaya = {
    name: "Haringlee Kasaya",
    restrict: ["Martialist"],
    slot: "Body",
    type: "Armour",
    bonus: {},
    action: Parry
  };
  var KhakkharaOfGhanju = {
    name: "Khakkhara of Ghanju",
    restrict: ["Martialist"],
    slot: "Hand",
    type: "Weapon",
    bonus: {},
    action: {
      name: "Sweep",
      tags: ["attack"],
      sp: 1,
      targets: opponents(3, [0, 1, 3]),
      act({ g, me, targets }) {
        g.applyDamage(me, targets, 4, "hp", "normal");
      }
    }
  };
  var Halberdigan = {
    name: "Halberdigan",
    restrict: ["Martialist"],
    slot: "Hand",
    type: "Weapon",
    bonus: { determination: 1 },
    action: {
      name: "Thrust",
      tags: ["attack"],
      sp: 2,
      targets: opponents(1, [0, 1, 3]),
      act({ g, me, targets }) {
        const amount = g.roll(me) + 3;
        g.applyDamage(me, targets, amount, "hp", "normal");
      }
    }
  };
  var NundarialVestments = {
    name: "Nundarial Vestments",
    restrict: ["Martialist"],
    slot: "Body",
    type: "Armour",
    bonus: { camaraderie: 1 },
    action: Brace
  };
  var HalflightCowl = {
    name: "Halflight Cowl",
    restrict: ["Martialist"],
    slot: "Body",
    bonus: {},
    action: Flight
  };
  var YamorolMouth = {
    name: "Yamorol's Mouth",
    restrict: ["Martialist"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Mantra",
      tags: [],
      sp: 3,
      targets: ally(1),
      act({ g, me, targets }) {
        me.determination--;
        for (const target of targets) {
          target.determination++;
          g.addToLog(`${me.name} gives everything to inspire ${target.name}.`);
        }
      }
    }
  };
  var LoromayHand = {
    name: "Loromay's Hand",
    restrict: ["Martialist"],
    slot: "Special",
    bonus: { spirit: 1 },
    action: {
      name: "Mudra",
      tags: ["buff", "duff"],
      sp: 3,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect(() => ({
          name: "Mudra",
          duration: 2,
          affects: [me],
          onCalculateDamage(e) {
            if (intersection(this.affects, [e.attacker, e.target]).length)
              e.multiplier *= 2;
          }
        }));
      }
    }
  };
  var LastEyeOfRaong = {
    name: "Last Eye of Raong",
    restrict: ["Martialist"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Chakra",
      tags: ["buff"],
      sp: 3,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect(() => ({
          name: "Chakra",
          duration: 2,
          affects: [me],
          buff: true,
          onRoll(e) {
            if (this.affects.includes(e.who))
              e.value = e.size;
          }
        }));
      }
    }
  };
  Penduchaimmer.lore = `Comprised of two anchors and bound together by threaded fibre plucked from spidokans, these traditional weapons of a martialist are built to stretch and spin much like the hands of a suspended gravity clock. Penduchaimmers are a reminder to all martialists that time will always find it's way back to the living, only in death does it cease.`;
  HaringleeKasaya.lore = `Traditional garb worn by martialist masters of Haringlee, they are awarded only to those that spend their lives in devotion to the practices of spirituality. The kasaya symbolizes the wholeness and total mastery of one's self, and one who's inner eye sees only their purpose in life.`;
  KhakkharaOfGhanju.lore = `Ghanju is known simply as the first martialist, and the clanging of his khakkhara began and ended many wars. History has stricken his name from most texts, however, as it's said Ghanju practised neither under Cherraphy or Mullanginan's teachings, nor those of any other God.`;
  Halberdigan.lore = `In times of peace, halberdigans were simply a tool for picking the fruits of the Ilbombora trees that littered Haringlee's countryside. A devastating fire set by Nightjar's residents and an ensuing drought was punishing enough that farmers began taking up martialism in the name of Cherraphy, in the hope that she'll restore the Ilbombora fields to their former glory.`;
  NundarialVestments.lore = `On the day of Nundarial's passing, it's said everyone wore these vestments at Cherraphy's order, to "honour a fool's futility". Historians wager this is in reference to Nundarial spending their lifetime weathering attacks behind closed doors, never striking back, forever without purpose, sleeping in the dulcet cradle of war.`;
  HalflightCowl.lore = `Commonly mistaken as a half light cowl. This cowl instead is named after Halfli's Flight, an ancient martialist technique that requires such speed and precision it gives off the appearance that it's user is flying. Though many martialists don this cowl, few are capable of performing Halfli's Flight to it's full potential.`;
  YamorolMouth.lore = `In all essence, a beginning. Words spoken aloud, repeated in infinite chanting verse. All words and meanings find a beginning from Yamorol, the primordial birthplace of all things and where even the spirits of Gods are born.`;
  LoromayHand.lore = `In all essence, an end. Gestures and actions performed, repeated in infinite repeating motion. All motion and form finds an ending from Loromay, the primordial deathbed of all things and where even the actions of Gods become meaningless.`;
  LastEyeOfRaong.lore = `In all essence, sense. Sight to view actions, sound to hear verse. All senses are owed to Raong, whom may only witness the world of Telnoth through this lens so viciously plucked from its being in the primordial age.`;

  // src/items/warCaller.ts
  var warCaller_exports = {};
  __export(warCaller_exports, {
    BrassHeartInsignia: () => BrassHeartInsignia,
    CherClaspeGauntlet: () => CherClaspeGauntlet,
    HairShirt: () => HairShirt,
    IronFullcase: () => IronFullcase,
    OwlSkull: () => OwlSkull,
    PlatesOfWhite: () => PlatesOfWhite,
    PolishedArenaShield: () => PolishedArenaShield,
    SaintGong: () => SaintGong,
    SternMask: () => SternMask
  });
  var OwlSkull = {
    name: "Owl's Skull",
    restrict: ["War Caller"],
    slot: "Hand",
    type: "Catalyst",
    bonus: {},
    action: Defy
  };
  var IronFullcase = {
    name: "Iron Fullcase",
    restrict: ["War Caller"],
    slot: "Body",
    type: "Armour",
    bonus: { dr: 1 },
    action: {
      name: "Endure",
      tags: ["buff"],
      sp: 2,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect(() => ({
          name: "Endure",
          duration: 2,
          affects: [me],
          buff: true,
          onCalculateDR(e) {
            if (this.affects.includes(e.who))
              e.value += 2;
          }
        }));
        const opposite = g.getOpponent(me);
        if (opposite) {
          g.addToLog(
            `${opposite.name} withers in the face of ${me.name}'s endurance!`
          );
          g.addEffect(() => ({
            name: "Endured",
            duration: 2,
            affects: [opposite],
            onCalculateDetermination(e) {
              if (this.affects.includes(e.who))
                e.value -= 2;
            }
          }));
        }
      }
    }
  };
  var PolishedArenaShield = {
    name: "Polished Arena-Shield",
    restrict: ["War Caller"],
    slot: "Hand",
    type: "Shield",
    bonus: { dr: 1 },
    action: {
      name: "Pose",
      tags: ["movement"],
      sp: 2,
      targets: opponents(),
      act({ g, me }) {
        const front = g.getPosition(me).dir;
        const right = rotate(front, 1);
        const back = rotate(front, 2);
        const left = rotate(front, 3);
        const frontIsEmpty = () => !g.getOpponent(me);
        const rightIsEmpty = () => !g.getOpponent(me, 1);
        const backIsEmpty = () => !g.getOpponent(me, 2);
        const leftIsEmpty = () => !g.getOpponent(me, 3);
        if (frontIsEmpty()) {
          if (!leftIsEmpty()) {
            g.moveEnemy(left, front);
          } else if (!rightIsEmpty()) {
            g.moveEnemy(right, front);
          }
        }
        if (!backIsEmpty) {
          if (leftIsEmpty()) {
            g.moveEnemy(back, left);
          } else if (rightIsEmpty()) {
            g.moveEnemy(back, right);
          }
        }
      }
    }
  };
  var BrassHeartInsignia = {
    name: "Brass Heart Insignia",
    restrict: ["War Caller"],
    slot: "Hand",
    type: "Catalyst",
    bonus: { dr: 1 },
    action: Bless
  };
  var HairShirt = {
    name: "Hair Shirt",
    restrict: ["War Caller"],
    slot: "Body",
    type: "Armour",
    bonus: { determination: 1 },
    action: {
      name: "Kneel",
      tags: ["duff"],
      sp: 0,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect(() => ({
          name: "Kneel",
          duration: 2,
          affects: [me],
          onCalculateDR(e) {
            if (this.affects.includes(e.who))
              e.value = 0;
          }
        }));
      }
    }
  };
  var PlatesOfWhite = {
    name: "Plates of White, Brass and Gold",
    restrict: ["War Caller"],
    slot: "Body",
    type: "Armour",
    bonus: { dr: 3 },
    action: {
      name: "Gleam",
      tags: ["buff"],
      sp: 3,
      targets: onlyMe,
      act({ g, me }) {
        g.addEffect((destroy) => ({
          name: "Gleam",
          duration: 2,
          affects: [me],
          onBeforeAction(e) {
            if (intersection(this.affects, e.targets).length && e.action.tags.includes("spell")) {
              e.cancel = true;
              g.addToLog(`The gleam disrupts the spell.`);
              destroy();
              return;
            }
          }
        }));
      }
    }
  };
  var SternMask = {
    name: "The Stern Mask",
    restrict: ["War Caller"],
    slot: "Special",
    bonus: { determination: 1 },
    action: {
      name: "Ram",
      tags: ["attack"],
      sp: 4,
      targets: oneOpponent,
      act({ g, me, targets }) {
        g.applyDamage(me, targets, 6, "hp", "normal");
        g.applyDamage(me, targets, 1, "camaraderie", "normal");
        g.applyDamage(me, targets, 6, "hp", "normal");
        g.applyDamage(me, targets, 1, "camaraderie", "normal");
        for (const target of targets) {
          if (target.camaraderie <= 0)
            g.applyDamage(me, [target], g.roll(me), "hp", "normal");
        }
      }
    }
  };
  var CherClaspeGauntlet = {
    name: "Cher-claspe Gauntlet",
    restrict: ["War Caller"],
    slot: "Special",
    bonus: {},
    action: {
      name: "Smash",
      tags: ["attack"],
      sp: 3,
      x: true,
      targets: oneOpponent,
      act({ g, me, targets, x }) {
        const magnitude = x + Math.floor(me.hp / me.maxHP * 8);
        g.applyDamage(me, targets, magnitude * 4, "hp", "normal");
      }
    }
  };
  var SaintGong = {
    name: "Saint's Gong",
    restrict: ["War Caller"],
    slot: "Special",
    bonus: { maxSP: 1 },
    action: {
      name: "Truce",
      tags: ["counter"],
      sp: 6,
      targets: { type: "enemy" },
      act({ g, targets }) {
        g.addEffect(() => ({
          name: "Truce",
          duration: 2,
          affects: targets,
          onCanAct(e) {
            if (this.affects.includes(e.who) && e.action.tags.includes("attack"))
              e.cancel = true;
          }
        }));
      }
    }
  };
  OwlSkull.lore = `All experienced knights know that menace lies mainly in the eyes, whether it be communicated via a glare through the slits of a full helmet or by a wild, haunting stare. War Callers find common ground with the owls that hunt their forests and sometimes try to tame them as familiars, as others do falcons in different realms.`;
  IronFullcase.lore = `A stiff layer of iron to protect the innards, sleeveless to allow flexibility in one's arms. Arena veterans favour such gear, goading their opponents with weapons brandished wildly, their chest remaining an impossible target to hit.`;
  PolishedArenaShield.lore = `As well as being a serviceable shield, this example has a percussive quality; when beaten with a club it resounds as a bell.`;
  BrassHeartInsignia.lore = `War Caller iconography is not to be shown to anyone who has studied medicine; the Brass Heart signifies that the will to heal one's self comes from the chest, always thrust proudly forwards to receive terrible blows. (Two weeks in bed and a poultice applied thrice daily notwithstanding.)`;
  HairShirt.lore = `A garment for penitents: the unwelcome itching generated by its wiry goat-hair lining must be surpassed through strength of will.`;
  PlatesOfWhite.lore = `An impressive suit of armour, decorated in the colours that the Crusaders of Cherraphy favour. Despite the lavish attention to presentation, it is no ceremonial costume: beneath the inlaid discs of fine metal, steel awaits to contest any oncoming blade.`;
  SternMask.lore = `A full helm, decorated in paint and fine metalwork to resemble the disdainful face of a saint. Each headbutt it delivers communicates severe chastisement.`;
  CherClaspeGauntlet.lore = `A pair of iron gauntlets ensorcelled with a modest enchantment; upon the command of a priest, these matching metal gloves each lock into the shape of a fist and cannot be undone by the bearer; a stricture that War Callers willingly bear, that it may sustain their resolve and dismiss their idle habits.`;
  SaintGong.lore = `A brass percussive disc mounted on a seven foot banner-pole and hung from hinge-chains, letting it swing freely enough that its shuddering surface rings clean. Most effective when tuned to the frequency of a chosen knight's bellows, allowing it to crash loudly in accompaniment with each war cry.`;

  // src/items/consumable.ts
  var consumable_exports = {};
  __export(consumable_exports, {
    HolyDew: () => HolyDew,
    LifeDew: () => LifeDew,
    Liquor: () => Liquor,
    ManaDew: () => ManaDew,
    Ration: () => Ration
  });
  var LifeDew = {
    name: "Life Dew",
    type: "Consumable",
    bonus: {},
    action: {
      name: "Scatter",
      tags: ["heal"],
      sp: 1,
      targets: ally(1),
      targetFilter: (c) => c.hp < c.maxHP,
      act({ g, me, targets }) {
        g.heal(me, targets, 3);
      }
    }
  };
  var ManaDew = {
    name: "Mana Dew",
    type: "Consumable",
    bonus: {},
    action: {
      name: "Scatter",
      tags: ["heal"],
      sp: 1,
      targets: ally(1),
      targetFilter: (c) => c.sp < c.maxSP,
      act({ g, targets }) {
        for (const target of targets) {
          const newSP = Math.min(target.maxSP, target.sp + 3);
          const gain = newSP - target.maxSP;
          if (gain) {
            target.sp += gain;
            g.addToLog(`${target.name} feels recharged.`);
          }
        }
      }
    }
  };
  var Liquor = {
    name: "Liquor",
    type: "Consumable",
    bonus: {},
    action: {
      name: "Drink",
      tags: ["heal"],
      sp: 1,
      targets: ally(1),
      act({ g, targets }) {
        for (const target of targets) {
          target.camaraderie++;
          g.addToLog(`${target.name} feels a little more convivial.`);
        }
      }
    }
  };
  var Ration = {
    name: "Ration",
    type: "Consumable",
    bonus: {},
    action: {
      name: "Eat",
      tags: ["heal"],
      sp: 1,
      targets: ally(1),
      act({ g, targets }) {
        for (const target of targets) {
          target.determination++;
          g.addToLog(`${target.name} feels a little more determined.`);
        }
      }
    }
  };
  var HolyDew = {
    name: "Holy Dew",
    type: "Consumable",
    bonus: {},
    action: {
      name: "Scatter",
      tags: ["heal"],
      sp: 1,
      targets: ally(1),
      act({ g, targets }) {
        for (const target of targets) {
          target.spirit++;
          g.addToLog(`${target.name} feels their hopes lift.`);
        }
      }
    }
  };

  // src/items/index.ts
  var allItems = Object.fromEntries(
    [
      cleavesman_exports,
      farScout_exports,
      flagSinger_exports,
      loamSeer_exports,
      martialist_exports,
      warCaller_exports,
      consumable_exports
    ].flatMap(
      (repository) => Object.values(repository).map((item) => [item.name, item])
    )
  );
  function getItem(s) {
    return allItems[s];
  }

  // res/sfx/buff1.ogg
  var buff1_default = "./buff1-X33WXBHF.ogg";

  // res/sfx/clank.ogg
  var clank_default = "./clank-SVQ65PBR.ogg";

  // res/sfx/cry1.ogg
  var cry1_default = "./cry1-J2YW3NUB.ogg";

  // res/sfx/death1.ogg
  var death1_default = "./death1-LNMY6PR7.ogg";

  // res/sfx/woosh.ogg
  var woosh_default = "./woosh-7BFHNSSE.ogg";

  // src/Sounds.ts
  var allSounds = {
    buff1: buff1_default,
    clank: clank_default,
    cry1: cry1_default,
    death1: death1_default,
    woosh: woosh_default
  };
  function isSoundName(name) {
    return typeof allSounds[name] === "string";
  }
  var Sounds = class {
    constructor(g) {
      this.g = g;
      for (const url of Object.values(allSounds))
        void g.res.loadAudio(url);
      g.eventHandlers.onKilled.add(
        ({ who }) => void this.play(who.isPC ? "cry1" : "death1")
      );
    }
    play(name) {
      return __async(this, null, function* () {
        const audio = yield this.g.res.loadAudio(allSounds[name]);
        audio.currentTime = 0;
        yield audio.play();
      });
    }
  };

  // src/types/Combatant.ts
  var AttackableStats = [
    "hp",
    "sp",
    "camaraderie",
    "determination",
    "spirit"
  ];

  // src/tools/combatants.ts
  function isStat(s) {
    return AttackableStats.includes(s);
  }

  // src/tools/arrays.ts
  function removeItem(array, item) {
    const index = array.indexOf(item);
    if (index >= 0) {
      array.splice(index, 1);
      return true;
    }
    return false;
  }

  // src/EngineInkScripting.ts
  var EngineInkScripting = class {
    constructor(g) {
      this.g = g;
      this.onTagEnter = /* @__PURE__ */ new Map();
      this.onTagInteract = /* @__PURE__ */ new Map();
      this.active = 0;
      this.skill = "NONE";
    }
    parseAndRun(source) {
      const program = new import_Story.Story(source);
      this.run(program);
    }
    run(program) {
      var _a;
      this.onTagEnter.clear();
      this.onTagInteract.clear();
      this.story = program;
      const getCell = (xy2) => {
        const pos = tagToXy(xy2);
        const cell = this.g.getCell(pos.x, pos.y);
        if (!cell)
          throw new Error(`Invalid cell: ${xy2}`);
        return cell;
      };
      const getDir = (dir) => {
        if (dir < 0 || dir > 3)
          throw new Error(`Invalid dir: ${dir}`);
        return dir;
      };
      const getPC = (index) => {
        if (index < 0 || index > 4)
          throw new Error(`Tried to get PC ${index}`);
        return this.g.party[index];
      };
      const getStat = (stat) => {
        if (!isStat(stat))
          throw new Error(`Invalid stat: ${stat}`);
        return stat;
      };
      const getEnemy = (name) => {
        if (!isEnemyName(name))
          throw new Error(`Invalid enemy: ${name}`);
        return name;
      };
      const getPositionByTag = (tag) => {
        const position = this.g.findCellWithTag(tag);
        if (!position)
          throw new Error(`Cannot find tag: ${tag}`);
        return position;
      };
      const getSide = (xy2, d) => {
        var _a2;
        const dir = getDir(d);
        const cell = getCell(xy2);
        const side = (_a2 = cell.sides[dir]) != null ? _a2 : {};
        if (!cell.sides[dir])
          cell.sides[dir] = side;
        return side;
      };
      const getSound = (name) => {
        if (!isSoundName(name))
          throw new Error(`invalid sound name: ${name}`);
        return name;
      };
      program.BindExternalFunction("active", () => this.active, true);
      program.BindExternalFunction("addArenaEnemy", (name) => {
        const enemy = getEnemy(name);
        this.g.pendingArenaEnemies.push(enemy);
      });
      program.BindExternalFunction("addTag", (xy2, tag) => {
        const cell = getCell(xy2);
        cell.tags.push(tag);
      });
      program.BindExternalFunction(
        "damagePC",
        (index, type, amount) => {
          const pc = getPC(index);
          const stat = getStat(type);
          this.g.applyDamage(pc, [pc], amount, stat, "normal");
        }
      );
      program.BindExternalFunction("facing", () => this.g.facing, true);
      program.BindExternalFunction(
        "forEachTaggedTile",
        (tag, callback) => {
          for (const pos of this.g.findCellsWithTag(tag))
            this.story.EvaluateFunction(callback.componentsString, [
              xyToTag(pos)
            ]);
        }
      );
      program.BindExternalFunction(
        "getDecal",
        (xy2, dir) => {
          var _a2;
          return (_a2 = getSide(xy2, dir).decal) != null ? _a2 : 0;
        },
        true
      );
      program.BindExternalFunction(
        "getNumber",
        (name) => {
          var _a2, _b;
          return (_b = (_a2 = this.g.currentCell) == null ? void 0 : _a2.numbers[name]) != null ? _b : 0;
        },
        true
      );
      program.BindExternalFunction(
        "getString",
        (name) => {
          var _a2, _b;
          return (_b = (_a2 = this.g.currentCell) == null ? void 0 : _a2.strings[name]) != null ? _b : "";
        },
        true
      );
      program.BindExternalFunction(
        "getTagPosition",
        (tag) => xyToTag(getPositionByTag(tag)),
        true
      );
      program.BindExternalFunction("giveItem", (name) => {
        const item = getItem(name);
        if (item)
          this.g.inventory.push(item);
      });
      program.BindExternalFunction("here", () => xyToTag(this.g.position), true);
      program.BindExternalFunction(
        "isArenaFightPending",
        () => this.g.pendingArenaEnemies.length > 0,
        true
      );
      program.BindExternalFunction(
        "move",
        (xy2, dir) => xyToTag(move(tagToXy(xy2), dir)),
        true
      );
      program.BindExternalFunction(
        "name",
        (dir) => this.g.party[dir].name,
        true
      );
      program.BindExternalFunction("playSound", (name) => {
        const sound = getSound(name);
        void this.g.sfx.play(sound);
      });
      program.BindExternalFunction("removeObject", (xy2) => {
        const cell = getCell(xy2);
        cell.object = void 0;
      });
      program.BindExternalFunction("removeTag", (xy2, tag) => {
        const cell = getCell(xy2);
        if (!removeItem(cell.tags, tag))
          console.warn(
            `script tried to remove tag ${tag} at ${xy2} -- not present`
          );
      });
      program.BindExternalFunction(
        "rotate",
        (dir, quarters) => rotate(dir, quarters),
        true
      );
      program.BindExternalFunction(
        "setDecal",
        (xy2, dir, decal) => {
          const side = getSide(xy2, dir);
          side.decal = decal;
        }
      );
      program.BindExternalFunction(
        "setObstacle",
        (blocked) => this.g.setObstacle(blocked)
      );
      program.BindExternalFunction(
        "setSolid",
        (xy2, dir, solid) => {
          const side = getSide(xy2, dir);
          side.solid = solid;
        }
      );
      program.BindExternalFunction("skill", () => this.skill, true);
      program.BindExternalFunction("skillCheck", (type, dc) => {
        const stat = getStat(type);
        const pc = this.g.party[this.active];
        const roll = this.g.roll(pc) + pc[stat];
        return roll >= dc;
      });
      program.BindExternalFunction("startArenaFight", () => {
        const count = this.g.pendingArenaEnemies.length;
        if (!count)
          return false;
        const enemies2 = this.g.pendingArenaEnemies.splice(0, count);
        this.g.combat.begin(enemies2, "arena");
        return true;
      });
      program.ContinueMaximally();
      for (const [name] of program.mainContentContainer.namedContent) {
        const entry = { name };
        const tags = (_a = program.TagsForContentAtPath(name)) != null ? _a : [];
        for (const tag of tags) {
          const [left, right] = tag.split(":");
          if (left === "enter")
            this.onTagEnter.set(right.trim(), entry);
          else if (left === "interact")
            this.onTagInteract.set(right.trim(), entry);
          else if (left === "once")
            entry.once = true;
          else
            throw new Error(`Unknown knot tag: ${left}`);
        }
      }
    }
    onEnter(pos) {
      const cell = this.g.getCell(pos.x, pos.y);
      if (!cell)
        return;
      this.active = this.g.facing;
      for (const tag of cell.tags) {
        const entry = this.onTagEnter.get(tag);
        if (entry) {
          this.story.ChoosePathString(entry.name);
          if (entry.once)
            removeItem(cell.tags, tag);
          const result = this.story.ContinueMaximally();
          if (result)
            this.g.addToLog(result);
        }
      }
    }
    onInteract(pcIndex) {
      const cell = this.g.currentCell;
      if (!cell)
        return false;
      let interacted = false;
      this.active = pcIndex;
      this.skill = this.g.party[pcIndex].skill;
      for (const tag of cell.tags) {
        const entry = this.onTagInteract.get(tag);
        if (entry) {
          this.story.ChoosePathString(entry.name);
          if (entry.once)
            removeItem(cell.tags, tag);
          interacted = true;
          const result = this.story.ContinueMaximally();
          if (result)
            this.g.addToLog(result);
        }
      }
      return interacted;
    }
  };

  // src/classes.ts
  var classes = {
    Martialist: {
      name: "Kirkwin",
      lore: `From birth, Kirkwin trained his body as a weapon, studying under the most brutal martialist sects that were allowed in Haringlee, and some that weren't. So it was to great surprise when Cherraphy appointed Kirkwin as the leader of Haringlee's guard; protector of the weak, defender of the pathetic as he saw it. Zealotry never suited Kirkwin, and rather than play his role as a coward soldier sitting idle, he abandons his post to join the assault on Nightjar, and in doing so vows to Cherraphy and Mullanginan both that they too will someday bleed and bow low.`,
      deathQuote: `Kirkwin's body sagged in the face of extreme odds, and he knew that his discipline had finally failed. His greatest fear was that his lifelong practises had served only to transform his youth into a carved body, a merciless expression and little else besides. Robbed of his strength, he found it easy to part with the remainder of his spirit.`,
      hp: 21,
      sp: 7,
      determination: 6,
      camaraderie: 2,
      spirit: 3,
      items: [Penduchaimmer, HaringleeKasaya],
      skill: "Smash"
    },
    Cleavesman: {
      name: "Mogrigg",
      lore: `The village's headsman, a role instigated by Cherraphy and chosen at random. Considered a luckless man, not blamed for the three lives he's taken at his god's behest. Was previously a loyal soldier and pikeman at a time when his lord was just and interested in protecting the border villages, before the man's personality crumbled into rote righteousness. Mogrigg still has the scars, but none of the respect he earned. Of course he volunteered to brave the Nightjar! His hand was the first to rise!`,
      deathQuote: `Somewhere behind the whirlwind of resentment and a deafening rush of blood hid Mogrigg's thoughts. Ever had they been on the topic of death, even when his party mates had made him cackle with laughter or introduced to him new ways of thinking. The death wish was just too much. He rushed gleefully towards his doom, as he had in every previous battle. This time, he met it.`,
      hp: 25,
      sp: 6,
      determination: 4,
      camaraderie: 4,
      spirit: 3,
      items: [GorgothilSword, Haringplate],
      skill: "Cut"
    },
    "Far Scout": {
      name: "Tam",
      lore: `The surest bow in Haringlee. Favouring high cliffs above the treetops, she is a very fine huntress who's found that her place in the village of her birth has become slowly less secure. Tam worships only as far as socially necessary, excusing herself more and more from the mania overtaking the populace. Still, that does leave more time to practise her woodscraft, her acrobacy and her deadly aim. Sensing the opportunity for change in the expedition to the Nightjar, she signs up, explaining that she already knows the best route over the river.`,
      deathQuote: `Tam knew she'd made a terrible error as she watched her comrades be dashed to the ground, fearing that her body was soon to join theirs. Yet it hadn't been a tactical mistake; she hadn't simply been tricked by Mullanginan's men. Instead, it had been an elementary failure from the onset: leaving the high ground? Voluntarily straying into the beast's lair? A huntress who ignored her instincts was a doomed one indeed.`,
      hp: 18,
      sp: 7,
      determination: 3,
      camaraderie: 3,
      spirit: 5,
      items: [BoltSlinger, AdaloaxPelt],
      skill: "Tamper"
    },
    "War Caller": {
      name: "Silas",
      lore: `Silas considers himself duty-bound to the goddess Cherraphy and exults her name without second thoughts. Blessed with unique conviction, his charmed surety in combat has increased even since his pit-fighting days; he now sees fit to call himself Knight-Enforcer and claim the ancient War Calling title from the old times... from before the wars made sense! Suspecting mischief and irreverence in the party that ventures to the Nightjar, he stubbornly joins, vowing to hold high the goddess's name. Yes, he's a nasty piece of work, but his arrogance serves to draw your enemy's ire away from your friends.`,
      deathQuote: `Silas stared at his hands, both of them stained with his life's blood, and found it all too much to believe. He had dedicated himself to the service of Cherraphy and had ultimately been spurned, receiving no divine intervention that might justify his devotion. No god appeared to witness Silas's final moments. The only reward granted to the man was a fool's death.`,
      hp: 30,
      sp: 5,
      determination: 5,
      camaraderie: 2,
      spirit: 4,
      items: [OwlSkull, IronFullcase],
      skill: "Prayer"
    },
    "Flag Singer": {
      name: "Belsome",
      lore: `A travelling auteur, stranded in Haringlee, their stagecoach impounded under the most arbitrary of Cherraphic laws. Before that, a bard, and before that, a wanted street thief. Now reformed as an entertainer, their reflexes remain true. Belsome has the instinct and the presence of mind needed to size up a dangerous situation, the savvy required to navigate it without incident and the compassion that also steers those around them to safety. Belsome doesn't know how vital their skills of performance, of misdirection and of psychic intuition will be inside the Fortress Nightjar, but this isn't exactly the first time they've performed without rehearsal.`,
      deathQuote: `Belsome dropped to their knees, knowing they'd been dealt a killing blow. Fitting enough; such a commanding performance should always end with a convincing death. Projecting all their passion and spite into one last speech, Belsome howled: "Curse the gods!" and keeled over into oblivion, their epitaph still resounding in the air.`,
      hp: 21,
      sp: 6,
      determination: 2,
      camaraderie: 6,
      spirit: 3,
      items: [CarvingKnife, SignedCasque],
      skill: "Sing"
    },
    "Loam Seer": {
      name: "Chiteri",
      lore: `Chiteri is a beetle-like humanoid who observes human activity from safety, where the river meets the wood. Sad at the many recent upheavals in Haringlee culture, Chiteri reveals her existence to the dumbfounded villagers and, furthermore, offers her magical assistance in their trip to the Nightjar, secretly planning to defame the goddess Cherraphy, thereby salvaging the lives of the people. Able to call on the magic dwelling deep within the earth, Chiteri is a canny healer and is also able to bestow curious magickal toughness to her quick new friends, even if she doesn't share their cause.`,
      deathQuote: `Her carapace smashed to pieces, Chiteri found herself slipping into a place of inward calm. It had been an ordeal to maintain her friendships with her human companions; now, she was glad for it to be over. Chiteri dispassionately transmitted her final verdicts to her many hive sisters, gladdened by glimpses of the Nightjar's primitive insects that quickly surrounded her body as she expired.`,
      hp: 18,
      sp: 5,
      determination: 2,
      camaraderie: 5,
      spirit: 4,
      items: [Cornucopia, JacketAndRucksack],
      skill: "Shift"
    }
  };
  var classes_default = classes;

  // src/Player.ts
  function getBaseStat(className, stat, bonusStat, bonusIfTrue = 1) {
    return classes_default[className][stat] + (bonusStat === stat ? bonusIfTrue : 0);
  }
  var Player = class {
    constructor(g, className, bonus, items = classes_default[className].items) {
      this.g = g;
      this.className = className;
      this.name = classes_default[className].name;
      this.isPC = true;
      this.attacksInARow = 0;
      this.usedThisTurn = /* @__PURE__ */ new Set();
      this.skill = classes_default[className].skill;
      for (const item of items) {
        if (item.slot)
          this.equip(item);
        else
          g.inventory.push(item);
      }
      this.baseMaxHP = getBaseStat(className, "hp", bonus, 5);
      this.baseMaxSP = getBaseStat(className, "sp", bonus);
      this.baseCamaraderie = getBaseStat(className, "camaraderie", bonus);
      this.baseDetermination = getBaseStat(className, "determination", bonus);
      this.baseSpirit = getBaseStat(className, "spirit", bonus);
      this.hp = this.maxHP;
      this.sp = Math.min(this.baseMaxSP, this.spirit);
    }
    get alive() {
      return this.hp > 0;
    }
    get equipment() {
      return [this.LeftHand, this.RightHand, this.Body, this.Special].filter(
        isDefined
      );
    }
    getStat(stat, base = 0) {
      var _a;
      let value = base;
      for (const item of this.equipment) {
        value += (_a = item == null ? void 0 : item.bonus[stat]) != null ? _a : 0;
      }
      return this.g.applyStatModifiers(this, stat, value);
    }
    get maxHP() {
      return this.getStat("maxHP", this.baseMaxHP);
    }
    get maxSP() {
      return this.getStat("maxHP", this.baseMaxSP);
    }
    get dr() {
      return this.getStat("dr", 0);
    }
    get camaraderie() {
      return this.getStat("camaraderie", this.baseCamaraderie);
    }
    get determination() {
      return this.getStat("determination", this.baseDetermination);
    }
    get spirit() {
      return this.getStat("spirit", this.baseSpirit);
    }
    get actions() {
      return Array.from(this.equipment.values()).map((i) => i.action).concat(generateAttack(), endTurnAction);
    }
    get canMove() {
      return !this.alive || this.sp > 0;
    }
    move() {
      if (this.alive)
        this.sp--;
    }
    equip(item) {
      if (!item.slot)
        return;
      if (item.slot === "Hand") {
        if (this.LeftHand && this.RightHand) {
          this.g.inventory.push(this.LeftHand);
          this.LeftHand = this.RightHand;
          this.RightHand = item;
          return;
        }
        if (this.LeftHand)
          this.RightHand = item;
        else
          this.LeftHand = item;
      } else {
        const old = this[item.slot];
        if (old)
          this.g.inventory.push(old);
        this[item.slot] = item;
      }
    }
  };

  // res/map.json
  var map_default = "./map-HXD5COAC.json";

  // src/TitleScreen.ts
  var TitleScreen = class {
    constructor(g) {
      this.g = g;
      g.draw();
      void g.jukebox.play("title");
      g.log = [];
      g.pendingArenaEnemies = [];
      g.pendingNormalEnemies = [];
      g.scripting = new EngineInkScripting(g);
      g.showLog = false;
      g.visited.clear();
      g.walls.clear();
      this.index = 0;
      this.selected = /* @__PURE__ */ new Set();
    }
    onKey(e) {
      this.g.jukebox.tryPlay();
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          e.preventDefault();
          this.g.draw();
          this.index = wrap(this.index - 1, ClassNames.length);
          break;
        case "ArrowDown":
        case "KeyS":
          e.preventDefault();
          this.g.draw();
          this.index = wrap(this.index + 1, ClassNames.length);
          break;
        case "Enter":
        case "Return": {
          e.preventDefault();
          this.g.draw();
          const cn = ClassNames[this.index];
          if (this.selected.has(cn))
            this.selected.delete(cn);
          else if (this.selected.size < 4)
            this.selected.add(cn);
          break;
        }
        case "Space":
          e.preventDefault();
          if (this.selected.size === 4) {
            this.g.inventory = [];
            this.g.party = [];
            for (const cn of this.selected)
              this.g.party.push(new Player(this.g, cn));
            startGame(this.selected);
            void this.g.loadGCMap(map_default, 0, -1);
          }
          break;
      }
    }
    render() {
      const { index, selected } = this;
      const { canvas, ctx } = this.g;
      {
        const { draw } = withTextStyle(ctx, {
          textAlign: "center",
          textBaseline: "middle",
          fillStyle: "white",
          fontSize: 20
        });
        draw("Poisoned Daggers", canvas.width / 2, 20);
        draw(
          selected.size === 4 ? "Press Space to begin" : "Pick 4 with Enter",
          canvas.width / 2,
          canvas.height - 20
        );
      }
      {
        const { draw, lineHeight, measure } = withTextStyle(ctx, {
          textAlign: "left",
          textBaseline: "middle",
          fillStyle: "white"
        });
        let y = 60;
        for (let i = 0; i < ClassNames.length; i++) {
          const cn2 = ClassNames[i];
          ctx.fillStyle = i === index ? selected.has(cn2) ? Colours_default.currentChosenClass : Colours_default.currentClass : selected.has(cn2) ? Colours_default.chosenClass : Colours_default.otherClass;
          draw(cn2, 20, y);
          y += lineHeight * 2;
        }
        const cn = ClassNames[this.index];
        const cl = classes_default[cn];
        ctx.fillStyle = "white";
        draw(cl.name, 100, 60);
        y = 60 + lineHeight * 2;
        for (const line of textWrap(cl.lore, canvas.width - 120, measure).lines) {
          draw(line, 100, y);
          y += lineHeight;
        }
      }
    }
  };

  // src/SplashScreen.ts
  var SplashScreen = class {
    constructor(g) {
      this.g = g;
      this.next = () => {
        clearTimeout(this.timeout);
        this.g.screen = new TitleScreen(this.g);
      };
      g.draw();
      this.position = xyi(g.canvas.width / 2, g.canvas.height / 2);
      this.timeout = setTimeout(this.next, 4e3);
      void g.res.loadImage(sad_folks_default).then((img) => {
        this.image = img;
        this.position = xyi(
          g.canvas.width / 2 - img.width / 2,
          g.canvas.height / 2 - img.height / 2
        );
        g.draw();
        return img;
      });
    }
    onKey(e) {
      e.preventDefault();
      this.next();
    }
    render() {
      if (!this.image) {
        return;
      }
      this.g.ctx.drawImage(this.image, this.position.x, this.position.y);
    }
  };

  // src/Grid.ts
  var Grid = class {
    constructor(defaultValue, toTag = xyToTag) {
      this.defaultValue = defaultValue;
      this.toTag = toTag;
      this.entries = /* @__PURE__ */ new Map();
      this.width = 0;
      this.height = 0;
    }
    set(xy2, item) {
      const tag = this.toTag(xy2);
      this.entries.set(tag, item);
      this.width = Math.max(this.width, xy2.x + 1);
      this.height = Math.max(this.height, xy2.y + 1);
    }
    get(xy2) {
      return this.entries.get(this.toTag(xy2));
    }
    getOrDefault(xy2) {
      const existing = this.get(xy2);
      if (existing)
        return existing;
      const value = this.defaultValue(xy2);
      this.set(xy2, value);
      return value;
    }
    asArray() {
      const rows = [];
      for (let y = 0; y < this.height; y++) {
        const row = [];
        for (let x = 0; x < this.width; x++)
          row.push(this.getOrDefault({ x, y }));
        rows.push(row);
      }
      return rows;
    }
  };

  // res/atlas/eveScout.png
  var eveScout_default = "./eveScout-GB6RQXWR.png";

  // res/atlas/eveScout.json
  var eveScout_default2 = "./eveScout-3RSQGX7M.json";

  // res/atlas/flats.png
  var flats_default = "./flats-YFBZMEC6.png";

  // res/atlas/flats.json
  var flats_default2 = "./flats-GGEKOGMO.json";

  // ink:D:\Code\dcjam2023\res\map.ink
  var map_default2 = "./map-BNQ2L6SR.ink";

  // res/atlas/martialist.png
  var martialist_default = "./martialist-KFK3S4GT.png";

  // res/atlas/martialist.json
  var martialist_default2 = "./martialist-NY4U3XPJ.json";

  // res/atlas/nettleSage.png
  var nettleSage_default = "./nettleSage-DUNOBTXQ.png";

  // res/atlas/nettleSage.json
  var nettleSage_default2 = "./nettleSage-FLJBTR3U.json";

  // res/atlas/sneedCrawler.png
  var sneedCrawler_default = "./sneedCrawler-B5CE42IQ.png";

  // res/atlas/sneedCrawler.json
  var sneedCrawler_default2 = "./sneedCrawler-5IJWBAV5.json";

  // src/resources.ts
  var Resources = {
    "map.ink": map_default2,
    "flats.png": flats_default,
    "flats.json": flats_default2,
    "eveScout.png": eveScout_default,
    "eveScout.json": eveScout_default2,
    "martialist.png": martialist_default,
    "martialist.json": martialist_default2,
    "nettleSage.png": nettleSage_default,
    "nettleSage.json": nettleSage_default2,
    "sneedCrawler.png": sneedCrawler_default,
    "sneedCrawler.json": sneedCrawler_default2
  };
  function getResourceURL(id) {
    const value = Resources[id];
    if (!value)
      throw new Error(`Invalid resource ID: ${id}`);
    return value;
  }

  // src/tools/sides.ts
  function openGate(side) {
    if (side.decalType === "Gate" && typeof side.decal === "number") {
      side.decalType = "OpenGate";
      side.decal++;
      side.solid = false;
    }
  }

  // src/convertGridCartographerMap.ts
  var wall = { wall: true, solid: true };
  var door = { decal: "Door", wall: true };
  var locked = { decal: "Door", wall: true, solid: true };
  var invisible = { solid: true };
  var fake = { wall: true };
  var sign = { decal: "Sign", wall: true, solid: true };
  var gate = { decal: "Gate", wall: false, solid: true };
  var lever = { decal: "Lever", wall: true, solid: true };
  var defaultEdge = { main: wall, opposite: wall };
  var EdgeDetails = {
    [2 /* Door */]: { main: door, opposite: door },
    [33 /* Door_Box */]: { main: door, opposite: door },
    [3 /* Door_Locked */]: { main: locked, opposite: locked },
    [8 /* Door_OneWayRD */]: { main: door, opposite: wall },
    [5 /* Door_OneWayLU */]: { main: wall, opposite: door },
    [13 /* Wall_Secret */]: { main: invisible, opposite: invisible },
    [10 /* Wall_OneWayRD */]: { main: fake, opposite: wall },
    [7 /* Wall_OneWayLU */]: { main: wall, opposite: fake },
    [28 /* Message */]: { main: sign, opposite: sign },
    [27 /* Gate */]: { main: gate, opposite: gate },
    [25 /* Bars */]: { main: fake, opposite: fake },
    // this isn't a mistake...
    [23 /* LeverLU */]: { main: lever, opposite: wall },
    [24 /* LeverRD */]: { main: wall, opposite: lever }
  };
  function compareNotes(a, b) {
    if (a.x !== b.x)
      return a.x - b.x;
    if (a.y !== b.y)
      return a.y - b.y;
    return 0;
  }
  var GCMapConverter = class {
    constructor(env = {}) {
      this.atlases = [];
      this.decals = /* @__PURE__ */ new Map();
      this.definitions = new Map(Object.entries(env));
      this.facing = Dir_default.N;
      this.grid = new Grid(() => ({
        sides: {},
        tags: [],
        strings: {},
        numbers: {}
      }));
      this.scripts = [];
      this.start = xy(0, 0);
      this.startsOpen = /* @__PURE__ */ new Set();
      this.textures = /* @__PURE__ */ new Map();
      this.definitions.set("NORTH", Dir_default.N);
      this.definitions.set("EAST", Dir_default.E);
      this.definitions.set("SOUTH", Dir_default.S);
      this.definitions.set("WEST", Dir_default.W);
    }
    tile(x, y) {
      return this.grid.getOrDefault({ x, y });
    }
    convert(j, region = 0, floor = 0) {
      var _a, _b;
      if (!(region in j.regions))
        throw new Error(`No such region: ${region}`);
      const r = j.regions[region];
      const f = r.floors.find((f2) => f2.index === floor);
      if (!f)
        throw new Error(`No such floor: ${floor}`);
      for (const note of f.notes.sort(compareNotes)) {
        const { __data, x, y } = note;
        for (const line of (_a = __data == null ? void 0 : __data.split("\n")) != null ? _a : []) {
          if (!line.startsWith("#"))
            continue;
          const [cmd, ...args] = line.split(" ");
          this.applyCommand(cmd, args.join(" "), x, y);
        }
      }
      for (const row of (_b = f.tiles.rows) != null ? _b : []) {
        let x = f.tiles.bounds.x0 + row.start;
        const y = r.setup.origin === "tl" ? row.y : f.tiles.bounds.height - (row.y - f.tiles.bounds.y0) - 1;
        for (const tile of row.tdata) {
          const mt = this.tile(x, y);
          const tag = xyToTag({ x, y });
          if (tile.t)
            mt.floor = this.getTexture(tile.tc);
          mt.ceiling = this.getTexture(0);
          if (tile.b)
            this.setEdge(
              tile.b,
              tile.bc,
              mt,
              Dir_default.S,
              this.tile(x, y + 1),
              Dir_default.N,
              this.startsOpen.has(tag)
            );
          if (tile.r)
            this.setEdge(
              tile.r,
              tile.rc,
              mt,
              Dir_default.E,
              this.tile(x + 1, y),
              Dir_default.W,
              this.startsOpen.has(tag)
            );
          x++;
        }
      }
      const { atlases, definitions, scripts, start, facing } = this;
      const name = `${r.name}_F${f.index}`;
      const cells = this.grid.asArray();
      return { name, atlases, cells, definitions, scripts, start, facing };
    }
    getTexture(index = 0) {
      const texture = this.textures.get(index);
      if (typeof texture === "undefined")
        throw new Error(`Unknown texture for palette index ${index}`);
      return texture;
    }
    eval(s) {
      const def = this.definitions.get(s);
      if (typeof def !== "undefined")
        return def;
      const num = Number(s);
      if (!isNaN(num))
        return num;
      throw new Error(`Could not evaluate: ${s}`);
    }
    applyCommand(cmd, arg, x, y) {
      switch (cmd) {
        case "#ATLAS":
          this.atlases.push(
            ...arg.split(",").map((name) => ({
              image: getResourceURL(name + ".png"),
              json: getResourceURL(name + ".json")
            }))
          );
          return;
        case "#DEFINE": {
          const [key, value] = arg.split(",");
          if (this.definitions.has(key))
            throw new Error(`Already defined: ${key}`);
          this.definitions.set(key, this.eval(value));
          return;
        }
        case "#STYLE": {
          const [index, value] = arg.split(",");
          this.textures.set(this.eval(index), this.eval(value));
          return;
        }
        case "#DECAL": {
          const [name, texture, decal] = arg.split(",");
          this.decals.set(`${name},${this.eval(texture)}`, this.eval(decal));
          return;
        }
        case "#START":
          this.start = { x, y };
          this.facing = dirFromInitial(arg);
          return;
        case "#TAG": {
          const t = this.tile(x, y);
          for (const tag of arg.split(","))
            t.tags.push(tag);
          break;
        }
        case "#SCRIPT":
          for (const id of arg.split(","))
            this.scripts.push(getResourceURL(id));
          break;
        case "#OBJECT":
          this.tile(x, y).object = this.eval(arg);
          break;
        case "#STRING": {
          const [name, ...args] = arg.split(",");
          this.tile(x, y).strings[name] = args.join(",").replace(/\\n/g, "\n");
          break;
        }
        case "#NUMBER": {
          const [name, value] = arg.split(",");
          this.tile(x, y).numbers[name] = this.eval(value);
          break;
        }
        case "#OPEN":
          this.startsOpen.add(xyToTag({ x, y }));
          break;
        default:
          throw new Error(`Unknown command: ${cmd} ${arg} at (${x},${y})`);
      }
    }
    setEdge(edge, index, lt, ld, rt, rd, opened) {
      var _a, _b, _c;
      const { main, opposite } = (_a = EdgeDetails[edge]) != null ? _a : defaultEdge;
      const texture = this.getTexture(index);
      const leftSide = {
        wall: main.wall ? texture : void 0,
        decalType: main.decal,
        decal: this.decals.get(`${(_b = main.decal) != null ? _b : ""},${texture}`),
        solid: main.solid
      };
      lt.sides[ld] = leftSide;
      const rightSide = {
        wall: opposite.wall ? texture : void 0,
        decalType: opposite.decal,
        decal: this.decals.get(`${(_c = opposite.decal) != null ? _c : ""},${texture}`),
        solid: opposite.solid
      };
      rt.sides[rd] = rightSide;
      if (opened) {
        openGate(leftSide);
        openGate(rightSide);
      }
    }
  };
  function convertGridCartographerMap(j, region = 0, floor = 0, env = {}) {
    const converter = new GCMapConverter(env);
    return converter.convert(j, region, floor);
  }

  // src/tools/aabb.ts
  function contains(spot, pos) {
    return pos.x >= spot.x && pos.y >= spot.y && pos.x < spot.ex && pos.y < spot.ey;
  }

  // src/tools/wallTags.ts
  function wallToTag(pos, dir) {
    return `${pos.x},${pos.y},${dir}`;
  }

  // src/types/events.ts
  var GameEventNames = [
    "onAfterAction",
    "onAfterDamage",
    "onBeforeAction",
    "onCalculateDamage",
    "onCalculateDR",
    "onCalculateCamaraderie",
    "onCalculateDetermination",
    "onCalculateSpirit",
    "onCalculateMaxHP",
    "onCalculateMaxSP",
    "onCanAct",
    "onCombatBegin",
    "onCombatOver",
    "onKilled",
    "onPartyMove",
    "onPartySwap",
    "onPartyTurn",
    "onRoll"
  ];

  // src/types/logic.ts
  var matchAll = (predicates) => (item) => {
    for (const p of predicates) {
      if (!p(item))
        return false;
    }
    return true;
  };

  // src/DeathScreen.ts
  var DeathScreen = class {
    constructor(g, lastToDie) {
      this.g = g;
      this.lastToDie = lastToDie;
      this.render = () => {
        const { width, height } = this.g.canvas;
        const { ctx } = this.g;
        if (this.alpha < 1) {
          this.oldScreen.render();
          ctx.globalAlpha = this.alpha;
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, width, height);
          this.alpha += 0.1;
          if (this.alpha >= 1) {
            clearInterval(this.interval);
            this.doNotClear = false;
          }
        }
        const { draw, lineHeight, measure } = withTextStyle(ctx, {
          textAlign: "center",
          textBaseline: "middle",
          fillStyle: "white"
        });
        const { lines } = textWrap(
          classes_default[this.lastToDie.className].deathQuote,
          width - 200,
          measure
        );
        const textHeight = lines.length * lineHeight;
        let y = height / 2 - textHeight / 2;
        for (const line of lines) {
          draw(line, width / 2, y);
          y += lineHeight;
        }
        ctx.globalAlpha = 1;
      };
      g.draw();
      g.spotElements = [];
      this.alpha = 0.1;
      this.doNotClear = true;
      this.interval = setInterval(this.render, 400);
      this.oldScreen = g.screen;
    }
    onKey(e) {
      if (e.code === "Escape" || this.alpha >= 1) {
        e.preventDefault();
        this.g.screen = new TitleScreen(this.g);
        if (this.interval)
          clearInterval(this.interval);
      }
    }
  };

  // src/Engine.ts
  var calculateEventName = {
    dr: "onCalculateDR",
    maxHP: "onCalculateMaxHP",
    maxSP: "onCalculateMaxSP",
    camaraderie: "onCalculateCamaraderie",
    determination: "onCalculateDetermination",
    spirit: "onCalculateSpirit"
  };
  var swap = (from, to) => ({ from, to });
  var Engine = class {
    constructor(canvas) {
      this.canvas = canvas;
      this.render = () => {
        const { ctx, screen } = this;
        const { width, height } = this.canvas;
        if (!screen.doNotClear) {
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, width, height);
        }
        screen.render();
      };
      this.ctx = getCanvasContext(canvas, "2d");
      this.eventHandlers = Object.fromEntries(
        GameEventNames.map((name) => [name, /* @__PURE__ */ new Set()])
      );
      this.zoomRatio = 1;
      this.controls = new Map(DefaultControls_default);
      this.facing = Dir_default.N;
      this.position = xyi(0, 0);
      this.worldSize = xyi(0, 0);
      this.res = new ResourceManager();
      this.drawSoon = new Soon(this.render);
      this.scripting = new EngineInkScripting(this);
      this.log = [];
      this.showLog = false;
      this.combat = new CombatManager(this);
      this.visited = /* @__PURE__ */ new Map();
      this.walls = /* @__PURE__ */ new Map();
      this.worldVisited = /* @__PURE__ */ new Set();
      this.worldWalls = /* @__PURE__ */ new Map();
      this.inventory = [];
      this.pendingArenaEnemies = [];
      this.pendingNormalEnemies = [];
      this.spotElements = [];
      this.party = [];
      this.jukebox = new Jukebox(this);
      this.sfx = new Sounds(this);
      this.screen = new SplashScreen(this);
      canvas.addEventListener("keyup", (e) => this.screen.onKey(e));
      const transform = (e) => xyi(e.offsetX / this.zoomRatio, e.offsetY / this.zoomRatio);
      canvas.addEventListener("mousemove", (e) => this.onMouseMove(transform(e)));
      canvas.addEventListener("click", (e) => this.onClick(transform(e)));
    }
    getSpot(pos) {
      for (const element of this.spotElements) {
        const spot = element.spots.find((s) => contains(s, pos));
        if (spot)
          return { element, spot };
      }
    }
    onMouseMove(pos) {
      var _a;
      const result = this.getSpot(pos);
      this.canvas.style.cursor = (_a = result == null ? void 0 : result.spot.cursor) != null ? _a : "";
    }
    onClick(pos) {
      const result = this.getSpot(pos);
      if (result)
        result.element.spotClicked(result.spot);
    }
    processInput(i) {
      switch (i) {
        case "Forward":
          return this.move(this.facing);
        case "SlideRight":
          return this.move(rotate(this.facing, 1));
        case "Back":
          return this.move(rotate(this.facing, 2));
        case "SlideLeft":
          return this.move(rotate(this.facing, 3));
        case "TurnLeft":
          return this.turn(-1);
        case "TurnRight":
          return this.turn(1);
        case "ToggleLog":
          return this.toggleLog();
        case "Interact":
          return this.interact(this.facing);
        case "MenuDown":
          return this.menuMove(1);
        case "MenuUp":
          return this.menuMove(-1);
        case "MenuChoose":
          return this.menuChoose();
        case "RotateLeft":
          return this.partyRotate(-1);
        case "RotateRight":
          return this.partyRotate(1);
        case "SwapLeft":
          return this.partySwap(-1);
        case "SwapRight":
          return this.partySwap(1);
        case "SwapBehind":
          return this.partySwap(2);
        case "Cancel":
          return this.cancel();
      }
    }
    loadWorld(w, position) {
      return __async(this, null, function* () {
        this.screen = new LoadingScreen(this);
        this.world = src_default(w);
        this.worldSize = xyi(this.world.cells[0].length, this.world.cells.length);
        this.position = position != null ? position : w.start;
        this.facing = w.facing;
        const combat = new CombatRenderer(this);
        const hud = new HUDRenderer(this);
        const log = new LogRenderer(this);
        const atlasPromises = w.atlases.map((a) => this.res.loadAtlas(a.json));
        const imagePromises = w.atlases.map((a) => this.res.loadImage(a.image));
        const atlases = yield Promise.all(atlasPromises);
        const images = yield Promise.all(imagePromises);
        yield hud.acquireImages();
        const dungeon = new DungeonRenderer(this, atlases[0], images[0]);
        for (let i = 0; i < atlases.length; i++) {
          yield dungeon.addAtlas(atlases[i].layers, images[i]);
          if (i > 1)
            dungeon.dungeon.layers.push(...atlases[i].layers);
        }
        const visited = this.visited.get(w.name);
        if (visited)
          this.worldVisited = visited;
        else {
          this.worldVisited = /* @__PURE__ */ new Set();
          this.visited.set(w.name, this.worldVisited);
        }
        const walls = this.walls.get(w.name);
        if (walls)
          this.worldWalls = walls;
        else {
          this.worldWalls = /* @__PURE__ */ new Map();
          this.walls.set(w.name, this.worldWalls);
        }
        this.markVisited();
        this.spotElements = [hud.skills, hud.stats];
        this.screen = new DungeonScreen(this, { combat, dungeon, hud, log });
        startArea(this.world.name);
        return this.draw();
      });
    }
    loadGCMap(jsonUrl, region, floor) {
      return __async(this, null, function* () {
        this.screen = new LoadingScreen(this);
        const map = yield this.res.loadGCMap(jsonUrl);
        const { atlases, cells, scripts, start, facing, name } = convertGridCartographerMap(map, region, floor, EnemyObjects);
        if (!atlases.length)
          throw new Error(`${jsonUrl} did not contain #ATLAS`);
        for (const url of scripts) {
          const code = yield this.res.loadScript(url);
          this.scripting.parseAndRun(code);
        }
        return this.loadWorld({ name, atlases, cells, start, facing });
      });
    }
    isVisited(x, y) {
      const tag = xyToTag({ x, y });
      return this.worldVisited.has(tag);
    }
    getCell(x, y) {
      var _a;
      if (x < 0 || x >= this.worldSize.x || y < 0 || y >= this.worldSize.y)
        return;
      const cell = (_a = this.world) == null ? void 0 : _a.cells[y][x];
      if (cell && this.combat.inCombat) {
        const result = getCardinalOffset(this.position, { x, y });
        if (result) {
          const enemy = this.combat.getFromOffset(result.dir, result.offset);
          if (enemy) {
            const replaced = src_default(cell);
            replaced.object = enemy.object;
            return replaced;
          }
        }
      }
      return cell;
    }
    get currentCell() {
      return this.getCell(this.position.x, this.position.y);
    }
    findCellWithTag(tag) {
      if (!this.world)
        return;
      for (let y = 0; y < this.worldSize.y; y++) {
        for (let x = 0; x < this.worldSize.x; x++) {
          if (this.world.cells[y][x].tags.includes(tag))
            return { x, y };
        }
      }
    }
    findCellsWithTag(tag) {
      if (!this.world)
        return [];
      const matches = [];
      for (let y = 0; y < this.worldSize.y; y++) {
        for (let x = 0; x < this.worldSize.x; x++) {
          if (this.world.cells[y][x].tags.includes(tag))
            matches.push({ x, y });
        }
      }
      return matches;
    }
    draw() {
      this.drawSoon.schedule();
    }
    canMove(dir) {
      const at = this.getCell(this.position.x, this.position.y);
      if (!at)
        return false;
      const wall2 = at.sides[dir];
      if (wall2 == null ? void 0 : wall2.solid)
        return false;
      const destination = move(this.position, dir);
      const cell = this.getCell(destination.x, destination.y);
      if (!cell)
        return false;
      return true;
    }
    move(dir) {
      if (this.combat.inCombat)
        return false;
      const destination = move(this.position, dir);
      if (this.obstacle && !sameXY(destination, this.obstacle))
        return false;
      if (this.canMove(dir)) {
        const old = this.position;
        this.position = destination;
        this.markVisited();
        this.markNavigable(old, dir);
        this.draw();
        this.setObstacle(false);
        this.fire("onPartyMove", { from: old, to: this.position });
        this.scripting.onEnter(this.position);
        return true;
      }
      this.markUnnavigable(this.position, dir);
      return false;
    }
    toggleLog() {
      this.showLog = !this.showLog;
      this.draw();
      return true;
    }
    interact(index) {
      if (!this.party[index].alive)
        return false;
      if (this.combat.inCombat)
        return false;
      return this.scripting.onInteract(index);
    }
    markVisited() {
      const pos = this.position;
      const tag = xyToTag(pos);
      const cell = this.getCell(pos.x, pos.y);
      if (!this.worldVisited.has(tag) && cell) {
        this.worldVisited.add(tag);
        for (let dir = 0; dir <= 3; dir++) {
          const wall2 = cell.sides[dir];
          const canSeeDoor = (wall2 == null ? void 0 : wall2.decalType) === "Door";
          const hasTexture = typeof (wall2 == null ? void 0 : wall2.wall) === "number";
          const looksSolid = hasTexture;
          const data = {
            canSeeDoor,
            isSolid: looksSolid && !canSeeDoor,
            canSeeWall: hasTexture
          };
          this.worldWalls.set(wallToTag(pos, dir), data);
        }
      }
    }
    markNavigable(pos, dir) {
      var _a;
      const tag = wallToTag(pos, dir);
      const data = (_a = this.worldWalls.get(tag)) != null ? _a : {
        canSeeDoor: false,
        isSolid: false,
        canSeeWall: false
      };
      if (data.isSolid) {
        data.isSolid = false;
        this.worldWalls.set(tag, data);
      }
    }
    markUnnavigable(pos, dir) {
      var _a;
      const tag = wallToTag(pos, dir);
      const data = (_a = this.worldWalls.get(tag)) != null ? _a : {
        canSeeDoor: false,
        isSolid: false,
        canSeeWall: false
      };
      if (!data.isSolid) {
        data.isSolid = true;
        this.worldWalls.set(tag, data);
        this.draw();
      }
    }
    getMinimapData(x, y) {
      if (!this.isVisited(x, y))
        return {};
      const cell = this.getCell(x, y);
      const north = this.getWallData(x, y, Dir_default.N);
      const east = this.getWallData(x, y, Dir_default.E);
      const south = this.getWallData(x, y, Dir_default.S);
      const west = this.getWallData(x, y, Dir_default.W);
      return { cell, north, east, south, west };
    }
    getWallData(x, y, dir) {
      const wallData = this.worldWalls.get(wallToTag({ x, y }, dir));
      const dTag = (wallData == null ? void 0 : wallData.canSeeDoor) ? "d" : "";
      const sTag = (wallData == null ? void 0 : wallData.isSolid) ? "s" : "";
      const wTag = (wallData == null ? void 0 : wallData.canSeeWall) ? "w" : "";
      return `${dTag}${sTag}${wTag}`;
    }
    turn(clockwise) {
      if (this.pickingTargets)
        return false;
      this.combat.index = 0;
      const old = this.facing;
      this.facing = rotate(old, clockwise);
      this.fire("onPartyTurn", { from: old, to: this.facing });
      this.draw();
      return true;
    }
    menuMove(mod) {
      if (this.pickingTargets)
        return false;
      if (!this.combat.inCombat)
        return false;
      if (this.combat.side === "enemy")
        return false;
      const actions = this.party[this.facing].actions;
      const index = wrap(this.combat.index + mod, actions.length);
      this.combat.index = index;
      this.draw();
      return true;
    }
    canAct(who, action) {
      if (action === endTurnAction)
        return true;
      if (!who.alive)
        return false;
      if (who.usedThisTurn.has(action.name))
        return false;
      const e = this.fire("onCanAct", { who, action, cancel: false });
      if (e.cancel)
        return false;
      if (action.sp > who.sp)
        return false;
      return true;
    }
    menuChoose() {
      if (this.pickingTargets)
        return false;
      if (!this.combat.inCombat)
        return false;
      if (this.combat.side === "enemy")
        return false;
      const pc = this.party[this.facing];
      const action = pc.actions[this.combat.index];
      if (!action)
        return false;
      if (!this.canAct(pc, action))
        return false;
      const { possibilities, amount } = this.getTargetPossibilities(pc, action);
      if (!possibilities.length) {
        this.addToLog("No valid targets.");
        return false;
      }
      if (possibilities.length > amount && action.targets.type === "ally") {
        if (amount !== 1)
          throw new Error(`Don't know how to pick ${amount} targets`);
        this.pickingTargets = { pc, action, possibilities };
        this.addToLog("Choose target.");
        return true;
      }
      const targets = pickN(possibilities, amount);
      this.act(pc, action, targets);
      return true;
    }
    getPosition(who) {
      return this.combat.getPosition(who);
    }
    getOpponent(me, turn = 0) {
      const { dir: myDir, distance } = this.getPosition(me);
      const dir = rotate(myDir, turn);
      return me.isPC ? this.combat.enemies[dir][0] : distance === 0 ? this.party[dir] : void 0;
    }
    getAllies(me, includeMe) {
      const allies = me.isPC ? this.party : this.combat.allEnemies;
      return includeMe ? allies : allies.filter((c) => c !== me);
    }
    getTargetPossibilities(c, a) {
      var _a;
      if (a.targets.type === "self")
        return { amount: 1, possibilities: [c] };
      const amount = (_a = a.targets.count) != null ? _a : Infinity;
      const filters = [
        a.targets.type === "ally" ? (o) => o.isPC === c.isPC : (o) => o.isPC !== c.isPC
      ];
      if (a.targetFilter)
        filters.push(a.targetFilter);
      const { distance, offsets } = a.targets;
      const me = this.getPosition(c);
      if (offsets)
        filters.push((o) => {
          const them = this.getPosition(o);
          return offsets.includes(getDirOffset(me.dir, them.dir));
        });
      if (typeof distance === "number")
        filters.push((o) => {
          const them = this.getPosition(o);
          const diff = Math.abs(them.distance - me.distance);
          return diff <= distance;
        });
      return {
        amount,
        possibilities: this.combat.aliveCombatants.filter(matchAll(filters))
      };
    }
    addToLog(message) {
      this.log.push(message);
      this.showLog = true;
      this.draw();
    }
    fire(name, e) {
      const handlers = this.eventHandlers[name];
      for (const handler of handlers)
        handler(e);
      return e;
    }
    act(me, action, targets) {
      var _a;
      const x = action.x ? me.sp : action.sp;
      me.sp -= x;
      me.usedThisTurn.add(action.name);
      const msg = ((_a = action.useMessage) != null ? _a : `[NAME] uses ${action.name}!`).replace(
        "[NAME]",
        me.name
      );
      if (msg)
        this.addToLog(msg);
      else
        this.draw();
      const e = this.fire("onBeforeAction", {
        attacker: me,
        action,
        targets,
        cancel: false
      });
      if (!e.cancel) {
        action.act({ g: this, targets, me, x });
        me.lastAction = action.name;
        if (action.name === "Attack") {
          me.attacksInARow++;
        } else
          me.attacksInARow = 0;
      }
      this.fire("onAfterAction", {
        attacker: me,
        action,
        targets,
        cancelled: e.cancel
      });
      this.combat.checkOver();
    }
    endTurn() {
      this.combat.endTurn();
    }
    addEffect(makeEffect) {
      const effect = makeEffect(() => this.removeEffect(effect));
      this.combat.effects.push(effect);
      for (const name of GameEventNames) {
        const handler = effect[name];
        if (handler) {
          const bound = handler.bind(effect);
          effect[name] = bound;
          this.eventHandlers[name].add(bound);
        }
      }
    }
    removeEffect(effect) {
      removeItem(this.combat.effects, effect);
      for (const name of GameEventNames) {
        const handler = effect[name];
        if (handler)
          this.eventHandlers[name].delete(handler);
      }
    }
    getEffectsOn(who) {
      return this.combat.effects.filter((e) => e.affects.includes(who));
    }
    removeEffectsFrom(effects, who) {
      for (const e of effects) {
        removeItem(e.affects, who);
        if (!e.affects.length)
          this.removeEffect(e);
      }
    }
    roll(who, size = 10) {
      const value = random(size) + 1;
      return this.fire("onRoll", { who, size, value }).value;
    }
    applyStatModifiers(who, stat, value) {
      const event = calculateEventName[stat];
      const e = this.fire(event, { who, value, multiplier: 1 });
      return Math.max(0, Math.floor(e.value * e.multiplier));
    }
    makePermanentDuff(target, stat, amount) {
      const effect = {
        name: "Scorn",
        duration: Infinity,
        permanent: true,
        affects: [target]
      };
      function calc(e) {
        if (this.affects.includes(e.who))
          e.value -= amount;
      }
      if (stat === "camaraderie")
        effect.onCalculateCamaraderie = calc;
      else if (stat === "determination")
        effect.onCalculateDetermination = calc;
      else if (stat === "spirit")
        effect.onCalculateSpirit = calc;
      return () => effect;
    }
    applyDamage(attacker, targets, amount, type, origin) {
      let total = 0;
      for (const target of targets.filter((x) => x.alive)) {
        const damage = this.fire("onCalculateDamage", {
          attacker,
          target,
          amount,
          multiplier: 1,
          type,
          origin
        });
        const calculated = damage.amount * damage.multiplier;
        const resist = type === "hp" && origin === "normal" ? target.dr : 0;
        const deal = Math.floor(calculated - resist);
        if (deal > 0) {
          total += deal;
          if (target.isPC && (type === "camaraderie" || type === "determination" || type === "spirit"))
            this.addEffect(this.makePermanentDuff(target, type, deal));
          else
            target[type] -= deal;
          this.draw();
          const message = type === "hp" ? `${target.name} takes ${deal} damage.` : `${target.name} loses ${deal} ${type}.`;
          this.addToLog(message);
          if (target.hp < 1)
            this.kill(target, attacker);
          else
            void this.sfx.play("woosh");
          this.fire("onAfterDamage", { attacker, target, amount, type, origin });
        } else {
          const message = type === "hp" ? `${target.name} ignores the blow.` : `${target.name} ignores the effect.`;
          this.addToLog(message);
        }
      }
      return total;
    }
    heal(healer, targets, amount) {
      let play = false;
      for (const target of targets) {
        const newHP = Math.min(target.hp + amount, target.maxHP);
        const gain = newHP - target.hp;
        if (gain) {
          play = true;
          target.hp = newHP;
          this.draw();
          const message = `${target.name} heals for ${gain}.`;
          this.addToLog(message);
        }
      }
      if (play)
        void this.sfx.play("buff1");
    }
    kill(who, attacker) {
      who.hp = 0;
      this.addToLog(`${who.name} dies!`);
      this.fire("onKilled", { who, attacker });
    }
    partyRotate(dir) {
      if (this.pickingTargets)
        return false;
      if (this.combat.inCombat) {
        const immobile = this.party.find((pc) => !pc.canMove);
        if (immobile)
          return false;
        for (const pc of this.party)
          pc.move();
      }
      if (dir === -1) {
        const north = this.party.shift();
        this.party.push(north);
        this.fire("onPartySwap", {
          swaps: [
            swap(Dir_default.N, Dir_default.W),
            swap(Dir_default.E, Dir_default.N),
            swap(Dir_default.S, Dir_default.E),
            swap(Dir_default.W, Dir_default.S)
          ]
        });
      } else {
        const west = this.party.pop();
        this.party.unshift(west);
        this.fire("onPartySwap", {
          swaps: [
            swap(Dir_default.N, Dir_default.E),
            swap(Dir_default.E, Dir_default.S),
            swap(Dir_default.S, Dir_default.W),
            swap(Dir_default.W, Dir_default.N)
          ]
        });
      }
      this.draw();
      return true;
    }
    partySwap(side) {
      if (this.pickingTargets)
        return false;
      const dir = rotate(this.facing, side);
      const me = this.party[this.facing];
      const them = this.party[dir];
      if (this.combat.inCombat) {
        if (!me.canMove || !them.canMove)
          return false;
        me.move();
        them.move();
      }
      this.party[this.facing] = them;
      this.party[dir] = me;
      this.fire("onPartySwap", {
        swaps: [swap(this.facing, dir), swap(dir, this.facing)]
      });
      this.draw();
      return true;
    }
    moveEnemy(from, to) {
      const fromArray = this.combat.enemies[from];
      const toArray = this.combat.enemies[to];
      const enemy = fromArray.shift();
      if (enemy) {
        toArray.unshift(enemy);
        this.draw();
      }
    }
    pcClicked(dir) {
      if (this.pickingTargets) {
        const { pc, action, possibilities } = this.pickingTargets;
        const target = this.party[dir];
        if (possibilities.includes(target)) {
          this.pickingTargets = void 0;
          this.act(pc, action, [target]);
          return;
        }
        this.addToLog("Invalid target.");
        return;
      }
      if (this.facing !== dir)
        this.partySwap(dir - this.facing);
    }
    cancel() {
      if (this.pickingTargets) {
        this.pickingTargets = void 0;
        this.addToLog("Cancelled.");
        return true;
      }
      return false;
    }
    addToInventory(name) {
      const item = getItem(name);
      if (item) {
        this.inventory.push(item);
        return true;
      }
      return false;
    }
    partyIsDead(lastToDie) {
      this.screen = new DeathScreen(this, this.party[lastToDie]);
      partyDied();
    }
    setObstacle(obstacle) {
      this.obstacle = obstacle ? move(this.position, rotate(this.facing, 2)) : void 0;
    }
  };

  // src/index.ts
  function loadEngine(parent) {
    startAnalytics();
    const container = document.createElement("div");
    parent.appendChild(container);
    const canvas = document.createElement("canvas");
    canvas.tabIndex = 1;
    container.appendChild(canvas);
    const g = new Engine(canvas);
    requestAnimationFrame(() => canvas.focus());
    window.g = g;
    const onResize = () => {
      const wantWidth = 480;
      const wantHeight = 270;
      const ratioWidth = Math.floor(window.innerWidth / wantWidth);
      const ratioHeight = Math.floor(window.innerHeight / wantHeight);
      const ratio = Math.max(1, Math.min(ratioWidth, ratioHeight));
      const width = wantWidth * ratio;
      const height = wantHeight * ratio;
      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
      canvas.width = wantWidth;
      canvas.height = wantHeight;
      g.zoomRatio = ratio;
      g.draw();
    };
    window.addEventListener("resize", onResize);
    onResize();
  }
  window.addEventListener("load", () => loadEngine(document.body));
})();
//# sourceMappingURL=bundle.js.map
