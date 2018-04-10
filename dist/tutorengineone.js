System.register("util/CUtil", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CUtil, __global;
    return {
        setters: [],
        execute: function () {
            CUtil = class CUtil extends Object {
                constructor() {
                    super();
                }
                static trace(message, ...alt) {
                    let fullMessage = "";
                    if (message instanceof Array) {
                    }
                    else if (arguments.length > 1) {
                        for (let item in arguments) {
                            fullMessage += fullMessage.concat(item, " ");
                        }
                        console.log(fullMessage);
                    }
                    else {
                        console.log(message);
                    }
                }
                static getTimer() {
                    return ((CUtil.now && CUtil.now.call(CUtil.w.performance)) || (new Date().getTime()));
                }
                static getQualifiedClassName(value) {
                    let type = typeof value;
                    if (!value || (type != "object" && !value.prototype)) {
                        return type;
                    }
                    let prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
                    if (prototype.hasOwnProperty("__class__")) {
                        return prototype["__class__"];
                    }
                    let constructorString = prototype.constructor.toString().trim();
                    let index = constructorString.indexOf("(");
                    let className = constructorString.substring(9, index);
                    Object.defineProperty(prototype, "__class__", {
                        value: className,
                        enumerable: false,
                        writable: true
                    });
                    return className;
                }
                getDefinitionByName(name) {
                    if (!name)
                        return null;
                    let definition = CUtil.getDefinitionByNameCache[name];
                    if (definition) {
                        return definition;
                    }
                    let paths = name.split(".");
                    let length = paths.length;
                    definition = __global;
                    for (let i = 0; i < length; i++) {
                        let path = paths[i];
                        definition = definition[path];
                        if (!definition) {
                            return null;
                        }
                    }
                    CUtil.getDefinitionByNameCache[name] = definition;
                    return definition;
                }
            };
            CUtil.w = window;
            CUtil.now = CUtil.w.performance.now || CUtil.w.performance.mozNow || CUtil.w.performance.msNow ||
                CUtil.w.performance.oNow || CUtil.w.performance.webkitNow;
            CUtil.getDefinitionByNameCache = {};
            exports_1("CUtil", CUtil);
            __global = this.__global || this;
        }
    };
});
System.register("mongo/MObject", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var MObject;
    return {
        setters: [],
        execute: function () {
            MObject = class MObject extends Object {
                constructor() {
                    super();
                }
            };
            exports_2("MObject", MObject);
        }
    };
});
System.register("mongo/CObject", ["mongo/MObject"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var MObject_1, CObject;
    return {
        setters: [
            function (MObject_1_1) {
                MObject_1 = MObject_1_1;
            }
        ],
        execute: function () {
            CObject = class CObject extends MObject_1.MObject {
                constructor() {
                    super();
                }
                getValue(tarObj, path) {
                    var objPath;
                    var dataObj;
                    try {
                        dataObj = tarObj;
                        objPath = path.split(".");
                        while (objPath.length > 1)
                            dataObj = dataObj[objPath.shift()];
                        return dataObj[objPath.shift()];
                    }
                    catch (err) {
                        return "";
                    }
                }
                setValue(tarObj, objPath, value) {
                    var dataObj;
                    var name;
                    dataObj = tarObj;
                    while (objPath.length > 1) {
                        name = objPath.shift();
                        if (dataObj[name] == null)
                            dataObj[name] = new Object;
                        dataObj = dataObj[name];
                    }
                    dataObj[objPath.shift()] = value;
                }
            };
            exports_3("CObject", CObject);
        }
    };
});
System.register("mongo/CMongo", ["util/CUtil", "mongo/MObject", "mongo/CObject"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var CUtil_1, MObject_2, CObject_1, CMongo;
    return {
        setters: [
            function (CUtil_1_1) {
                CUtil_1 = CUtil_1_1;
            },
            function (MObject_2_1) {
                MObject_2 = MObject_2_1;
            },
            function (CObject_1_1) {
                CObject_1 = CObject_1_1;
            }
        ],
        execute: function () {
            CMongo = class CMongo {
                constructor() {
                }
                static commandPacket(_source, _command, _collection, _query, _database = "TED") {
                    let packet;
                    let multi = false;
                    let type;
                    let item;
                    packet = '{"database":"' + _database + '","source":"' + _source + '","command":' + _command + ',"collection":"' + _collection + '","query":{';
                    for (item in _query) {
                        if (multi)
                            packet += ',';
                        packet += '"' + item + '":';
                        type = CUtil_1.CUtil.getQualifiedClassName(_query[item]);
                        switch (type) {
                            case "string":
                                packet += '"' + _query[item] + '"';
                                break;
                            default:
                                packet += _query[item];
                                break;
                        }
                        multi = true;
                    }
                    packet += '}}';
                    return packet;
                }
                static queryPacket(_source, _command, _collection, _query, _limit = null, _database = "TED") {
                    let packet;
                    let multi = false;
                    let multilimit = false;
                    let type;
                    let item;
                    packet = '{"database":"' + _database + '","source":"' + _source + '","command":' + _command + ',"collection":"' + _collection + '","query":{';
                    for (item in _query) {
                        if (multi)
                            packet += ',';
                        packet += '"' + item + '":';
                        type = CUtil_1.CUtil.getQualifiedClassName(_query[item]);
                        switch (type) {
                            case "string":
                                packet += '"' + _query[item] + '"';
                                break;
                            default:
                                packet += _query[item];
                                break;
                        }
                        multi = true;
                    }
                    packet += '}, "fields":{';
                    for (item in _limit) {
                        if (multilimit)
                            packet += ',';
                        packet += '"' + item + '":';
                        type = CUtil_1.CUtil.getQualifiedClassName(_limit[item]);
                        switch (type) {
                            case "string":
                                packet += '"' + _limit[item] + '"';
                                break;
                            default:
                                packet += _limit[item];
                                break;
                        }
                        multilimit = true;
                    }
                    packet += '}}';
                    return packet;
                }
                static recyclePacket(_source, _command, _collection, _query, recover) {
                    let packet;
                    let multi = false;
                    packet = '{"source":"' + _source + '","command":' + _command + ',"collection":"' + _collection + '","query":{';
                    for (let item in _query) {
                        if (multi)
                            packet += ',';
                        packet += '"' + item + '":"' + _query[item] + '"';
                        multi = true;
                    }
                    packet += '}, "document":{"\$set":{"isActive":' + recover + '}}}';
                    return packet;
                }
                static insertPacket(_source, _command, _collection, _objectDoc) {
                    let packet;
                    let multi = false;
                    packet = '{"source":"' + _source + '","command":' + _command + ',"collection":"' + _collection + '","document":';
                    packet += JSON.stringify(_objectDoc);
                    packet += '}';
                    return packet;
                }
                static updatePacket(_source, _command, _collection, _query, _updateObj) {
                    let packet;
                    let multi = false;
                    let item;
                    packet = '{"source":"' + _source + '","command":' + _command + ',"collection":"' + _collection + '","query":{';
                    for (item in _query) {
                        if (multi)
                            packet += ',';
                        packet += '"' + item + '":"' + _query[item] + '"';
                        multi = true;
                    }
                    multi = false;
                    packet += '}, "document":{"\$set":{';
                    packet += this.parseUpdateFields(_updateObj);
                    packet += '}}}';
                    return packet;
                }
                static unsetFieldPacket(_source, _command, _collection, _query, _updateObj) {
                    let packet;
                    let multi = false;
                    let item;
                    packet = '{"source":"' + _source + '","command":' + _command + ',"collection":"' + _collection + '","query":{';
                    for (item in _query) {
                        if (multi)
                            packet += ',';
                        packet += '"' + item + '":"' + _query[item] + '"';
                        multi = true;
                    }
                    multi = false;
                    packet += '}, "document":{"\$unset":{';
                    packet += this.parseUpdateFields(_updateObj);
                    packet += '}}}';
                    return packet;
                }
                static parseUpdateFields(node, objPath = "") {
                    let objString = "";
                    let className;
                    let fieldMark = false;
                    for (let value in node) {
                        className = CUtil_1.CUtil.getQualifiedClassName(node[value]);
                        if (className == "Object") {
                            CUtil_1.CUtil.trace("type Error: parseUpdateFields");
                            throw (new Error("type Error: parseUpdateFields"));
                        }
                        if (node[value] instanceof CObject_1.CObject) {
                            if (fieldMark)
                                objString += ',';
                            fieldMark = false;
                            objString += this.parseUpdateFields(node[value], objPath + value + '.');
                        }
                        else {
                            if (objString.length > 0)
                                objString += ',';
                            objString += '"' + objPath + value + '"' + ':';
                            if (node[value] instanceof MObject_2.MObject)
                                objString += JSON.stringify(node[value]);
                            else {
                                if (typeof node[value] === "string")
                                    objString += '"' + node[value] + '"';
                                else
                                    objString += node[value];
                            }
                            fieldMark = true;
                        }
                    }
                    return objString;
                }
                static encodeAsJSON(_fields, parent) {
                    return JSON.stringify(this.encodeAsObject(null, _fields, parent));
                }
                static encodeAsObject(host, _fields, parent) {
                    let tempObj = new Object;
                    let leafObj;
                    let subDocName;
                    let pathArray;
                    if (host == null)
                        tempObj = new Object;
                    else
                        tempObj = host;
                    for (let formID in _fields) {
                        leafObj = tempObj;
                        pathArray = _fields[formID].split(".");
                        if (pathArray.length > 1) {
                            subDocName = pathArray.shift();
                            if (leafObj[subDocName] == undefined)
                                leafObj[subDocName] = new Object;
                            leafObj = this.objectBuilder(leafObj[subDocName], pathArray);
                        }
                        leafObj[pathArray[0]] = parent[formID].getItemData();
                    }
                    return tempObj;
                }
                static objectBuilder(leafObj, pathArray) {
                    let subDocName;
                    if (pathArray.length > 1) {
                        subDocName = pathArray.shift();
                        if (leafObj[subDocName] == undefined)
                            leafObj[subDocName] = new Object;
                        leafObj = this.objectBuilder(leafObj, pathArray);
                    }
                    return leafObj;
                }
                static setValue(tarObj, path, value) {
                    let objPath;
                    let dataObj;
                    let name;
                    dataObj = tarObj;
                    objPath = path.split(".");
                    while (objPath.length > 1) {
                        name = objPath.shift();
                        if (dataObj[name] == null)
                            dataObj[name] = new CObject_1.CObject;
                        dataObj = dataObj[name];
                    }
                    dataObj[objPath.shift()] = value;
                }
            };
            CMongo.FIND = '"find"';
            CMongo.INSERT = '"insert"';
            CMongo.CREATEACCT = '"createacct"';
            CMongo.UPSERT = '"upsert"';
            CMongo.UPDATE = '"update"';
            CMongo.UNSET = '"unset"';
            CMongo.REMOVE = '"remove"';
            CMongo.RECYCLE = '"recycle"';
            CMongo.RECOVER = '"recover"';
            CMongo.DBCOMMAND = '"dbcommand"';
            CMongo.DBRUN_DBCOMMAND = "dbcommand";
            CMongo.DBRUN_LISTDBS = "listdatabases";
            CMongo.DBRUN_LISTCOLS = "listcollections";
            CMongo.DBRUN_DROPCOLLECTION = "dropcollection";
            CMongo.DBRUN_UPDATEDOCUMENT = "updatedocument";
            CMongo.ACK_FIND = 'find';
            CMongo.ACK_INSERT = 'insert';
            CMongo.ACK_CREATEACCT = 'createacct';
            CMongo.ACK_UPSERT = 'upsert';
            CMongo.ACK_UPDATE = 'update';
            CMongo.ACK_UNSET = 'unset';
            CMongo.ACK_REMOVE = 'remove';
            CMongo.ACK_RECYCLE = 'recycle';
            CMongo.ACK_RECOVER = 'recover';
            CMongo.ACK_DBCOMMAND = 'dbcommand';
            CMongo.QUERY_ALL = "";
            CMongo.LOG_PACKET = '"LOG_PACKET"';
            CMongo.LOG_TERMINATE = '"LOG_TERMINATE"';
            CMongo.LOG_PROGRESS = '"LOG_PROGRESS"';
            CMongo.ACKLOG_PACKET = 'LOG_PACKET';
            CMongo.ACKLOG_TERMINATE = 'LOG_TERMINATE';
            CMongo.ACKLOG_PROGRESS = 'LOG_PROGRESS';
            CMongo.ACKLOG_NAK = 'NAK_ERROR';
            CMongo._READY = "READY";
            CMongo._INPROGRESS = "IN PROGRESS";
            CMongo._COMPLETE = "COMPLETE";
            exports_4("CMongo", CMongo);
        }
    };
});
System.register("events/CEFEvent", ["util/CUtil"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Event, CUtil_2, CEFEvent;
    return {
        setters: [
            function (CUtil_2_1) {
                CUtil_2 = CUtil_2_1;
            }
        ],
        execute: function () {
            Event = createjs.Event;
            CEFEvent = class CEFEvent extends Event {
                constructor(TarObjID, type, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                    this.tarObjID = TarObjID;
                }
                clone() {
                    CUtil_2.CUtil.trace("cloning WOZEvent:");
                    return new CEFEvent(this.tarObjID, this.type, this.bubbles, this.cancelable);
                }
                captureLogState(obj = null) {
                    if (obj == null)
                        obj = new Object;
                    obj['target'] = this.tarObjID;
                    obj['type'] = this.type;
                    obj['bubbles'] = this.bubbles;
                    obj['cancelable'] = this.cancelable;
                    return obj;
                }
                captureXMLState() {
                    var xmlVal = "<CEFEvent target={tarObjID} type={type} bubbles={bubbles} cancelable={cancelable}/>";
                    return xmlVal;
                }
                restoreXMLState(xmlState) {
                }
                compareXMLState(xmlState) {
                    return false;
                }
                trace(message) {
                    let fullMessage = "";
                    if (Array.isArray(message)) {
                        for (let item of message) {
                            fullMessage += fullMessage.concat(item, " ");
                        }
                        console.log(fullMessage);
                    }
                    else {
                        fullMessage = message;
                    }
                    console.log(fullMessage);
                }
            };
            CEFEvent.ENTER_FRAME = "enterFrame";
            CEFEvent.ADDED_TO_STAGE = "added";
            CEFEvent.REMOVED_FROM_STAGE = "removed";
            CEFEvent.MOTION_FINISH = "complete";
            CEFEvent.CHANGE = "change";
            CEFEvent.COMPLETE = "complete";
            exports_5("CEFEvent", CEFEvent);
        }
    };
});
System.register("core/CEFDoc", ["mongo/CMongo", "core/CEFRoot", "core/CEFTutorRoot", "events/CEFEvent", "util/CUtil"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var CMongo_1, CEFRoot_1, CEFTutorRoot_1, CEFEvent_1, CUtil_3, CEFDoc;
    return {
        setters: [
            function (CMongo_1_1) {
                CMongo_1 = CMongo_1_1;
            },
            function (CEFRoot_1_1) {
                CEFRoot_1 = CEFRoot_1_1;
            },
            function (CEFTutorRoot_1_1) {
                CEFTutorRoot_1 = CEFTutorRoot_1_1;
            },
            function (CEFEvent_1_1) {
                CEFEvent_1 = CEFEvent_1_1;
            },
            function (CUtil_3_1) {
                CUtil_3 = CUtil_3_1;
            }
        ],
        execute: function () {
            CEFDoc = class CEFDoc extends CEFRoot_1.CEFRoot {
                constructor() {
                    super();
                    this.logFrameID = 0;
                    this.logStateID = 0;
                    CUtil_3.CUtil.trace("CEFDoc:Constructor");
                    CEFDoc.gApp = this;
                }
                initOnStage(evt) {
                    CUtil_3.CUtil.trace("CEFDoc:Object OnStage");
                    this.connectFrameCounter(true);
                }
                launchTutors() {
                    this.resetStateFrameID();
                    if (CEFRoot_1.CEFRoot.sessionAccount["session"].profile.progress == CMongo_1.CMongo._INPROGRESS) {
                        CEFDoc.tutorAutoObj["SnavPanel"].instance.recoverState();
                    }
                    else {
                        CEFDoc.tutorAutoObj["SnavPanel"].instance.gotoNextScene();
                    }
                }
                resetStateFrameID() {
                    this.frameID = 0;
                    this.stateID = 0;
                }
                get frameID() {
                    return this.logFrameID;
                }
                set frameID(newVal) {
                    this.logFrameID = newVal;
                }
                incFrameID() {
                    this.logFrameID++;
                }
                get stateID() {
                    return this.logStateID;
                }
                set stateID(newVal) {
                    this.logStateID = newVal;
                }
                incStateID() {
                    if (this.traceMode)
                        CUtil_3.CUtil.trace("@@@@@@@@@ logStateID Update : " + this.logStateID);
                    this.logStateID++;
                    this.frameID = 0;
                }
                connectFrameCounter(fCon) {
                    if (fCon)
                        addEventListener(CEFEvent_1.CEFEvent.ENTER_FRAME, this.doEnterFrame);
                    else
                        removeEventListener(CEFEvent_1.CEFEvent.ENTER_FRAME, this.doEnterFrame);
                }
                doEnterFrame(evt) {
                    this.incFrameID();
                }
                dumpTutors() {
                    if (this.traceMode)
                        CUtil_3.CUtil.trace("\n*** Start root dump ALL tutors ***");
                    for (let tutor of CEFDoc.tutorAutoObj) {
                        if (this.traceMode)
                            CUtil_3.CUtil.trace("TUTOR : " + tutor);
                        if (CEFDoc.tutorAutoObj[tutor].instance instanceof CEFTutorRoot_1.CEFTutorRoot) {
                            if (this.traceMode)
                                CUtil_3.CUtil.trace("CEF***");
                            CEFDoc.tutorAutoObj[tutor].instance.dumpScenes(CEFDoc.tutorAutoObj[tutor]);
                        }
                    }
                    if (this.traceMode)
                        CUtil_3.CUtil.trace("*** End root dump tutor structure ***");
                }
            };
            CEFDoc.designWidth = 1024;
            CEFDoc.designHeight = 768;
            exports_6("CEFDoc", CEFDoc);
        }
    };
});
System.register("events/CEFMouseEvent", ["util/CUtil"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var CUtil_4, MouseEvent, CEFMouseEvent;
    return {
        setters: [
            function (CUtil_4_1) {
                CUtil_4 = CUtil_4_1;
            }
        ],
        execute: function () {
            MouseEvent = createjs.MouseEvent;
            CEFMouseEvent = class CEFMouseEvent extends MouseEvent {
                constructor(TarObjID, type, bubbles, cancelable, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY) {
                    super(type, bubbles, cancelable, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY);
                    this.localX = rawX;
                    this.localY = rawY;
                }
                clone() {
                    CUtil_4.CUtil.trace("cloning WOZEvent:");
                    return new CEFMouseEvent(this.tarObjID, this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY);
                }
                captureLogState(obj = null) {
                    obj['event'] = 'CEFMouseEvent';
                    obj['tarObjID'] = this.tarObjID;
                    obj['localX'] = this.localX;
                    obj['localY'] = this.localY;
                    return obj;
                }
                captureXMLState() {
                    var eventState = {};
                    return eventState;
                }
                restoreXMLState(xmlState) {
                }
                compareXMLState(xmlState) {
                    var bTest = true;
                    return bTest;
                }
            };
            CEFMouseEvent.MOUSE_MOVE = "mousemove";
            CEFMouseEvent.MOUSE_DOWN = "mousedown";
            CEFMouseEvent.MOUSE_UP = "mouseup";
            CEFMouseEvent.MOUSE_CLICK = "click";
            CEFMouseEvent.DOUBLE_CLICK = "dblclick";
            CEFMouseEvent.CLICK = "click";
            CEFMouseEvent.WOZCLICK = "WOZMOUSE_CLICK";
            CEFMouseEvent.WOZCLICKED = "WOZMOUSE_CLICKED";
            CEFMouseEvent.WOZDBLCLICK = "WOZMOUSE_DBLCLICKED";
            CEFMouseEvent.WOZMOVE = "WOZMOUSE_MOVE";
            CEFMouseEvent.WOZDOWN = "WOZMOUSE_DOWN";
            CEFMouseEvent.WOZUP = "WOZMOUSE_UP";
            CEFMouseEvent.WOZOVER = "WOZMOUSE_OVER";
            CEFMouseEvent.WOZOUT = "WOZMOUSE_OUT";
            CEFMouseEvent.WOZKEYDOWN = "WOZKEY_DOWN";
            CEFMouseEvent.WOZKEYUP = "WOZMKEY_UP";
            CEFMouseEvent.WOZNULL = "WOZNULL";
            exports_7("CEFMouseEvent", CEFMouseEvent);
        }
    };
});
System.register("events/CEFTextEvent", ["util/CUtil", "events/CEFEvent"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var CUtil_5, CEFEvent_2, CEFTextEvent;
    return {
        setters: [
            function (CUtil_5_1) {
                CUtil_5 = CUtil_5_1;
            },
            function (CEFEvent_2_1) {
                CEFEvent_2 = CEFEvent_2_1;
            }
        ],
        execute: function () {
            CEFTextEvent = class CEFTextEvent extends CEFEvent_2.CEFEvent {
                constructor(TarObjID, Type, Index1 = 0, Index2 = 0, TextData = "", Bubbles = false, Cancelable = false) {
                    super(TarObjID, Type, Bubbles, Cancelable);
                    this.textdata = TextData;
                    this.index1 = Index1;
                    this.index2 = Index2;
                }
                clone() {
                    CUtil_5.CUtil.trace("cloning CEFTextEvent:");
                    return new CEFTextEvent(this.tarObjID, this.type, this.index1, this.index2, this.textdata, this.bubbles, this.cancelable);
                }
            };
            CEFTextEvent.WOZSETSELECTION = "wozSetSelection";
            CEFTextEvent.WOZSETSCROLL = "wozSetScroll";
            CEFTextEvent.WOZINPUTTEXT = "wozInputText";
            CEFTextEvent.WOZCAPTUREFOCUS = "wozCaptureFocus";
            CEFTextEvent.WOZRELEASEFOCUS = "wozReleaseFocus";
            exports_8("CEFTextEvent", CEFTextEvent);
        }
    };
});
System.register("core/CEFCursorProxy", ["core/CEFRoot", "core/CEFObject", "core/CEFScene", "events/CEFMouseEvent", "events/CEFTextEvent", "util/CUtil"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var CEFRoot_2, CEFObject_1, CEFScene_1, CEFMouseEvent_1, CEFTextEvent_1, CUtil_6, Point, Tween, Ease, CEFCursorProxy;
    return {
        setters: [
            function (CEFRoot_2_1) {
                CEFRoot_2 = CEFRoot_2_1;
            },
            function (CEFObject_1_1) {
                CEFObject_1 = CEFObject_1_1;
            },
            function (CEFScene_1_1) {
                CEFScene_1 = CEFScene_1_1;
            },
            function (CEFMouseEvent_1_1) {
                CEFMouseEvent_1 = CEFMouseEvent_1_1;
            },
            function (CEFTextEvent_1_1) {
                CEFTextEvent_1 = CEFTextEvent_1_1;
            },
            function (CUtil_6_1) {
                CUtil_6 = CUtil_6_1;
            }
        ],
        execute: function () {
            Point = createjs.Point;
            Tween = createjs.Tween;
            Ease = createjs.Ease;
            CEFCursorProxy = class CEFCursorProxy extends CEFRoot_2.CEFRoot {
                constructor() {
                    super();
                    this.curObject = null;
                    this.actObject = null;
                    this.cLocation = new Point;
                    this.fSparkler = true;
                    this.fSparklerTest = false;
                    this.fSparklerDrag = false;
                    this.fLiveLog = false;
                    this.traceMode = false;
                    if (this.traceMode)
                        CUtil_6.CUtil.trace("CEFCursorProxy:Constructor");
                    this.name = "WOZvCursor";
                    this.setCursorStyle("Sstandard");
                }
                setCursorStyle(style) {
                    this.Sstandard.visible = false;
                    this.Ssmallhand.visible = false;
                    this.Shand.visible = false;
                    this.Sautomate.visible = false;
                    this[style].visible = true;
                }
                initWOZCursor(sMode) {
                    if (this.traceMode)
                        CUtil_6.CUtil.trace("Initializing WOZ Cursor Automation:");
                    this.sAuto = sMode;
                    if (sMode == CEFCursorProxy.WOZLIVE) {
                        this.stage.addEventListener(CEFMouseEvent_1.CEFMouseEvent.MOUSE_MOVE, this.liveMouseMove);
                        this.stage.addEventListener(CEFMouseEvent_1.CEFMouseEvent.MOUSE_DOWN, this.liveMouseDown);
                        this.stage.addEventListener(CEFMouseEvent_1.CEFMouseEvent.MOUSE_UP, this.liveMouseUp);
                        this.stage.addEventListener(CEFMouseEvent_1.CEFMouseEvent.DOUBLE_CLICK, this.liveMouseDblClick);
                    }
                    else if (sMode == CEFCursorProxy.WOZREPLAY) {
                        this.stage.removeEventListener(CEFMouseEvent_1.CEFMouseEvent.MOUSE_MOVE, this.liveMouseMove);
                        this.stage.removeEventListener(CEFMouseEvent_1.CEFMouseEvent.MOUSE_DOWN, this.liveMouseDown);
                        this.stage.removeEventListener(CEFMouseEvent_1.CEFMouseEvent.MOUSE_UP, this.liveMouseUp);
                        this.stage.removeEventListener(CEFMouseEvent_1.CEFMouseEvent.DOUBLE_CLICK, this.liveMouseDblClick);
                    }
                }
                decodeTarget(baseObj, objArray) {
                    let tmpObject = null;
                    let subObject;
                    subObject = objArray.shift();
                    if (this.traceMode)
                        CUtil_6.CUtil.trace("decoding: " + subObject);
                    if ((subObject != "null") && (subObject != "none")) {
                        tmpObject = baseObj[subObject];
                        if (objArray.length)
                            tmpObject = this.decodeTarget(tmpObject, objArray);
                    }
                    return tmpObject;
                }
                initPlayBack() {
                    this.lastFrameTime = 0;
                }
                playBackAction(wozEvt) {
                    let traceAction = false;
                    let tarObject;
                    let objArray;
                    if (traceAction)
                        CUtil_6.CUtil.trace("PlayBack Action: " + wozEvt);
                    if (wozEvt.CEFMouseEvent != undefined) {
                        this.x = wozEvt.CEFMouseEvent.localX;
                        this.y = wozEvt.CEFMouseEvent.localY;
                        if (this.fSparklerTest) {
                            this.fSparklerTest = false;
                            if (wozEvt.CEFMouseEvent.CEFEvent.type.toString() == CEFMouseEvent_1.CEFMouseEvent.WOZMOVE)
                                this.fSparklerDrag = true;
                        }
                        if ((wozEvt.CEFMouseEvent.CEFEvent.type.toString() == CEFMouseEvent_1.CEFMouseEvent.WOZDOWN) && this.fSparkler) {
                            this.fSparklerDrag = false;
                            this.fSparklerTest = true;
                            this.Ssparkle.gotoAndPlay(2);
                        }
                        if ((wozEvt.CEFMouseEvent.CEFEvent.type.toString() == CEFMouseEvent_1.CEFMouseEvent.WOZUP) && this.fSparklerDrag)
                            this.Ssparkle.gotoAndPlay(10);
                        if (traceAction)
                            CUtil_6.CUtil.trace("Splitting: " + wozEvt.CEFMouseEvent.CEFEvent.target + " EVT TYPE: " + wozEvt.CEFMouseEvent.CEFEvent.type);
                        objArray = wozEvt.CEFMouseEvent.CEFEvent.target.split(".");
                        if (traceAction)
                            CUtil_6.CUtil.trace("Target Array: " + objArray[0]);
                        tarObject = this.decodeTarget(CEFRoot_2.CEFRoot.gTutor, objArray);
                        if (tarObject) {
                            if (traceAction)
                                CUtil_6.CUtil.trace("Automation Target: " + tarObject + " Event: " + wozEvt.CEFMouseEvent.CEFEvent.type);
                            let evt = new CEFMouseEvent_1.CEFMouseEvent(tarObject.objID, wozEvt.CEFMouseEvent.CEFEvent.type, wozEvt.bubbles, wozEvt.cancelable, wozEvt.stageX, wozEvt.stageY, wozEvt.nativeEvent, wozEvt.pointerID, wozEvt.primary, wozEvt.rawX, wozEvt.rawY);
                            tarObject.dispatchEvent(evt);
                        }
                    }
                    else if (wozEvt.CEFTextEvent != undefined) {
                        if (traceAction)
                            CUtil_6.CUtil.trace("Splitting: " + wozEvt.CEFTextEvent.CEFEvent.target + " EVT TYPE: " + wozEvt.CEFTextEvent.CEFEvent.type);
                        if (wozEvt.CEFTextEvent.CEFEvent.type == CEFTextEvent_1.CEFTextEvent.WOZINPUTTEXT) {
                            objArray = wozEvt.CEFTextEvent.CEFEvent.target.split(".");
                            if (traceAction)
                                CUtil_6.CUtil.trace("Target Array: " + objArray[0]);
                            tarObject = this.decodeTarget(CEFRoot_2.CEFRoot.gTutor, objArray);
                            if (tarObject) {
                                if (traceAction)
                                    CUtil_6.CUtil.trace("Automation Target: " + tarObject + " Event: " + wozEvt.CEFTextEvent.CEFEvent.type);
                                let tEvt = new CEFTextEvent_1.CEFTextEvent(tarObject.objID, wozEvt.CEFTextEvent.CEFEvent.type, wozEvt.CEFTextEvent.index1, wozEvt.CEFTextEvent.index2, wozEvt.CEFTextEvent.text, true, false);
                                tarObject.dispatchEvent(tEvt);
                            }
                        }
                    }
                }
                playBackMove(nextMove, frameTime) {
                    let relTime = (frameTime - this.lastFrameTime) / (nextMove.time - this.lastFrameTime);
                    if (this.traceMode)
                        CUtil_6.CUtil.trace("PlayBack Move");
                    this.x += relTime * (nextMove.CEFMouseEvent.localX - this.x);
                    this.y += relTime * (nextMove.CEFMouseEvent.localY - this.y);
                    this.lastFrameTime = frameTime;
                    if (this.traceMode)
                        CUtil_6.CUtil.trace("-- Target X: " + nextMove.CEFMouseEvent.localX + " -- Target Y: " + nextMove.CEFMouseEvent.localY);
                    if (this.traceMode)
                        CUtil_6.CUtil.trace("-- Mouse  X: " + this.x + " -- Mouse  Y: " + this.y);
                }
                replayEvent(xEvt) {
                    let tarObject;
                    let objArray;
                    this.x = xEvt.localX;
                    this.y = xEvt.localY;
                    if (this.fSparklerTest) {
                        this.fSparklerTest = false;
                        if (xEvt.CEFEvent.type.toString() == CEFMouseEvent_1.CEFMouseEvent.WOZMOVE)
                            this.fSparklerDrag = true;
                    }
                    if ((xEvt.CEFEvent.type.toString() == CEFMouseEvent_1.CEFMouseEvent.WOZDOWN) && this.fSparkler) {
                        this.fSparklerDrag = false;
                        this.fSparklerTest = true;
                        this.Ssparkle.gotoAndPlay(2);
                    }
                    if ((xEvt.CEFEvent.type.toString() == CEFMouseEvent_1.CEFMouseEvent.WOZUP) && this.fSparklerDrag)
                        this.Ssparkle.gotoAndPlay(10);
                    if (this.traceMode)
                        CUtil_6.CUtil.trace("Splitting: " + xEvt.CEFEvent.target + " EVT TYPE: " + xEvt.CEFEvent.type);
                    objArray = xEvt.CEFEvent.target.split(".");
                    if (this.traceMode)
                        CUtil_6.CUtil.trace("Target Array: " + objArray[0]);
                    tarObject = this.decodeTarget(CEFRoot_2.CEFRoot.gTutor, objArray);
                    if (tarObject) {
                        if (this.traceMode)
                            CUtil_6.CUtil.trace("Automation Target: " + tarObject + " Event: " + xEvt.CEFEvent.type);
                        let evt = new CEFMouseEvent_1.CEFMouseEvent(tarObject.objID, xEvt.CEFEvent.type, xEvt.bubbles, xEvt.cancelable, xEvt.stageX, xEvt.stageY, xEvt.nativeEvent, xEvt.pointerID, xEvt.primary, xEvt.rawX, xEvt.rawY);
                        tarObject.dispatchEvent(evt);
                    }
                }
                replayEventB(xEvt) {
                    let tarObject;
                    this.x = xEvt.localX;
                    this.y = xEvt.localY;
                    tarObject = this.hitTestCoord(this.x, this.y);
                    if (tarObject) {
                        switch (xEvt.CEFEvent.type.toString()) {
                            case CEFMouseEvent_1.CEFMouseEvent.WOZMOVE:
                                return;
                            case CEFMouseEvent_1.CEFMouseEvent.WOZOUT:
                                tarObject = this.curObject;
                                break;
                            case CEFMouseEvent_1.CEFMouseEvent.WOZOVER:
                                this.curObject = tarObject;
                                break;
                            case CEFMouseEvent_1.CEFMouseEvent.WOZUP:
                                tarObject = this.actObject;
                                break;
                            case CEFMouseEvent_1.CEFMouseEvent.WOZDOWN:
                                this.actObject = this.curObject;
                                tarObject = this.curObject;
                                break;
                            case CEFMouseEvent_1.CEFMouseEvent.WOZCLICKED:
                                tarObject = this.actObject;
                                break;
                            case CEFMouseEvent_1.CEFMouseEvent.WOZDBLCLICK:
                                tarObject = this.actObject;
                                break;
                        }
                        if (this.traceMode)
                            CUtil_6.CUtil.trace("Automation Target: " + tarObject + " Event: " + xEvt.CEFEvent.type);
                        let evt = new CEFMouseEvent_1.CEFMouseEvent(tarObject.objID, xEvt.CEFEvent.type, xEvt.bubbles, xEvt.cancelable, xEvt.stageX, xEvt.stageY, xEvt.nativeEvent, xEvt.pointerID, xEvt.primary, xEvt.rawX, xEvt.rawY);
                        tarObject.dispatchEvent(evt);
                    }
                }
                replayEventAndMove(xEvt, laEvt, l2Evt) {
                    let tweens;
                    let easingX;
                    let easingY;
                    let v1;
                    let v2;
                    let dX;
                    let dY;
                    this.replayEvent(xEvt);
                    let replayTime = (laEvt.CEFEvent.evtTime - xEvt.CEFEvent.evtTime) / 1000;
                    let replayTim2 = (l2Evt.CEFEvent.evtTime - laEvt.CEFEvent.evtTime) / 1000;
                    if (replayTime > 0) {
                        if (l2Evt == null) {
                            easingX = Ease.cubicOut;
                            easingY = Ease.cubicOut;
                        }
                        else {
                            dX = Math.abs(laEvt.localX - xEvt.localX);
                            v1 = dX / replayTime;
                            v2 = Math.abs(l2Evt.localX - laEvt.localX) / replayTim2;
                            if (this.traceMode)
                                CUtil_6.CUtil.trace("delta T:" + replayTime + " : " + replayTim2);
                            if (this.traceMode)
                                CUtil_6.CUtil.trace("X: v1/v2:  " + (v1 / v2));
                            if (dX < 10) {
                                if (this.traceMode)
                                    CUtil_6.CUtil.trace("Easing X: Ease.linear");
                                easingX = Ease.linear;
                            }
                            else if ((v1 == 0) || (v2 == 0)) {
                                if (this.traceMode)
                                    CUtil_6.CUtil.trace("Easing X: Ease.linear");
                                easingX = Ease.linear;
                            }
                            else if ((v1 / v2) > 3.5) {
                                if (this.traceMode)
                                    CUtil_6.CUtil.trace("Easing X: Ease.cubicOut");
                                easingX = Ease.cubicOut;
                            }
                            else if ((v1 / v2) < .30) {
                                if (this.traceMode)
                                    CUtil_6.CUtil.trace("Easing X: Ease.cubicIn");
                                easingX = Ease.cubicIn;
                            }
                            else {
                                if (this.traceMode)
                                    CUtil_6.CUtil.trace("Easing X: Ease.linear");
                                easingX = Ease.linear;
                            }
                            dY = Math.abs(laEvt.localY - xEvt.localY);
                            v1 = dY / replayTime;
                            v2 = Math.abs(l2Evt.localY - laEvt.localY) / replayTim2;
                            if (this.traceMode)
                                CUtil_6.CUtil.trace("Y: v1/v2:  " + (v1 / v2));
                            if (dY < 10) {
                                if (this.traceMode)
                                    CUtil_6.CUtil.trace("Easing X: Ease.linear");
                                easingY = Ease.linear;
                            }
                            else if ((v1 == 0) || (v2 == 0)) {
                                if (this.traceMode)
                                    CUtil_6.CUtil.trace("Easing X: Ease.linear");
                                easingY = Ease.linear;
                            }
                            else if ((v1 / v2) > 3.5) {
                                if (this.traceMode)
                                    CUtil_6.CUtil.trace("Easing Y: Ease.cubicOut");
                                easingY = Ease.cubicOut;
                            }
                            else if ((v1 / v2) < .30) {
                                if (this.traceMode)
                                    CUtil_6.CUtil.trace("Easing Y: Ease.cubicIn");
                                easingY = Ease.cubicIn;
                            }
                            else {
                                if (this.traceMode)
                                    CUtil_6.CUtil.trace("Easing Y: Ease.linear");
                                easingY = Ease.linear;
                            }
                        }
                        tweens = new Array;
                        tweens[0] = new Tween(this).to({ x: laEvt.localX }, replayTime, easingX);
                        tweens[1] = new Tween(this).to({ y: laEvt.localY }, replayTime, easingY);
                    }
                    return tweens;
                }
                replayMove(oldTime, laEvt) {
                    let tweens;
                    let replayTime = (laEvt.CEFEvent.evtTime - oldTime) / 1000;
                    if (replayTime > 0) {
                        tweens = new Array;
                        tweens[0] = new Tween(this).to({ x: laEvt.localX }, replayTime, Ease.cubicInOut);
                        tweens[1] = new Tween(this).to({ y: laEvt.localY }, replayTime, Ease.cubicInOut);
                    }
                    return tweens;
                }
                liveMouseMove(evt) {
                    let evtMove;
                    let fUpdate = false;
                    let locX;
                    let locY;
                    locX = evt.stageX;
                    locY = evt.stageY;
                    if (this.x != locX) {
                        this.x = locX;
                        fUpdate = true;
                    }
                    if (this.y != locY) {
                        this.y = locY;
                        fUpdate = true;
                    }
                    if (fUpdate) {
                        this.hitTestMouse(evt);
                        if (this.curObject) {
                            if (this.traceMode)
                                CUtil_6.CUtil.trace("CEF Mouse Move : " + this.curObject.objID);
                            evtMove = new CEFMouseEvent_1.CEFMouseEvent("none", CEFMouseEvent_1.CEFMouseEvent.WOZMOVE, evt.bubbles, evt.cancelable, evt.stageX, evt.stageY, evt.nativeEvent, evt.pointerID, evt.primary, evt.rawX, evt.rawY);
                            if (this.fLiveLog)
                                this.gLogR.logLiveEvent(evtMove.captureLogState());
                            this.curObject.dispatchEvent(evtMove);
                        }
                        else {
                            if (this.traceMode)
                                CUtil_6.CUtil.trace("NULL Mouse Move : ");
                            evtMove = new CEFMouseEvent_1.CEFMouseEvent("none", CEFMouseEvent_1.CEFMouseEvent.WOZMOVE, evt.bubbles, evt.cancelable, evt.stageX, evt.stageY, evt.nativeEvent, evt.pointerID, evt.primary, evt.rawX, evt.rawY);
                            if (this.fLiveLog)
                                this.gLogR.logLiveEvent(evtMove.captureLogState());
                        }
                    }
                }
                liveMouseDown(evt) {
                    let locX;
                    let locY;
                    locX = evt.stageX;
                    locY = evt.stageY;
                    this.hitTestMouse(evt);
                    if (this.curObject) {
                        if (this.traceMode)
                            CUtil_6.CUtil.trace("CEF Mouse Down : " + this.curObject.objID);
                        let evtDown = new CEFMouseEvent_1.CEFMouseEvent(this.curObject.objID, CEFMouseEvent_1.CEFMouseEvent.WOZDOWN, evt.bubbles, evt.cancelable, evt.stageX, evt.stageY, evt.nativeEvent, evt.pointerID, evt.primary, evt.rawX, evt.rawY);
                        if (this.fLiveLog)
                            this.gLogR.logLiveEvent(evtDown.captureLogState());
                        this.curObject.dispatchEvent(evtDown);
                        this.actObject = this.curObject;
                    }
                }
                liveMouseUp(evt) {
                    if (this.traceMode)
                        CUtil_6.CUtil.trace("CEF Mouse Up : " + ((this.curObject) ? this.curObject.objID : "null"));
                    let locX;
                    let locY;
                    if (this.actObject) {
                        let evtUp = new CEFMouseEvent_1.CEFMouseEvent(this.actObject.objID, CEFMouseEvent_1.CEFMouseEvent.WOZUP, evt.bubbles, evt.cancelable, evt.stageX, evt.stageY, evt.nativeEvent, evt.pointerID, evt.primary, evt.rawX, evt.rawY);
                        if (this.fLiveLog)
                            this.gLogR.logLiveEvent(evtUp.captureLogState());
                        this.actObject.dispatchEvent(evtUp);
                        if (this.actObject == this.curObject) {
                            if (this.traceMode)
                                CUtil_6.CUtil.trace("CEF Mouse Click : " + this.curObject.objID + "  At X:" + locX + "  Y:" + locY);
                            let evtClicked = new CEFMouseEvent_1.CEFMouseEvent(this.curObject.objID, CEFMouseEvent_1.CEFMouseEvent.WOZCLICKED, evt.bubbles, evt.cancelable, evt.stageX, evt.stageY, evt.nativeEvent, evt.pointerID, evt.primary, evt.rawX, evt.rawY);
                            if (this.fLiveLog)
                                this.gLogR.logLiveEvent(evtClicked.captureLogState());
                            this.curObject.dispatchEvent(evtClicked);
                        }
                    }
                    this.actObject = null;
                }
                liveMouseDblClick(evt) {
                    let locX;
                    let locY;
                    if (this.curObject) {
                        if (this.traceMode)
                            CUtil_6.CUtil.trace("CEF Mouse Dbl Clicked: " + this.curObject.objID);
                        let evtDblClick = new CEFMouseEvent_1.CEFMouseEvent(this.curObject.objID, CEFMouseEvent_1.CEFMouseEvent.WOZDBLCLICK, evt.bubbles, evt.cancelable, evt.stageX, evt.stageY, evt.nativeEvent, evt.pointerID, evt.primary, evt.rawX, evt.rawY);
                        if (this.fLiveLog)
                            this.gLogR.logLiveEvent(evtDblClick.captureLogState());
                        this.curObject.dispatchEvent(evtDblClick);
                    }
                }
                stateHelper(tarObj) {
                    let fTest = false;
                    if (this.hitTestCoord(this.x, this.y) == tarObj)
                        fTest = true;
                    return fTest;
                }
                hitTestCoord(locX, locY) {
                    let hitSet;
                    let hitObj;
                    let wozObj;
                    this.cLocation.x = locX;
                    this.cLocation.y = locY;
                    hitSet = this.stage.getObjectsUnderPoint(locX, locY, 0);
                    if (this.traceMode)
                        CUtil_6.CUtil.trace("Hittest results  - cursor name: " + name);
                    if (hitSet.length) {
                        hitObj = hitSet[hitSet.length - 1];
                        wozObj = this.isWOZObject(hitObj);
                        if (!wozObj && (hitSet.length > 1)) {
                            hitObj = hitSet[hitSet.length - 2];
                            wozObj = this.isWOZObject(hitObj);
                        }
                    }
                    if (wozObj)
                        if (this.traceMode)
                            CUtil_6.CUtil.trace("HitTest WozObject Name - " + wozObj.name);
                    return wozObj;
                }
                hitTestMouse(evt) {
                    let hitObj;
                    hitObj = this.hitTestCoord(this.x, this.y);
                    if (hitObj || (!hitObj && (this.actObject == null)))
                        this.updateCurrentObject(evt, hitObj);
                }
                show(bFlag) {
                    if (bFlag) {
                        if (this.traceMode)
                            CUtil_6.CUtil.trace("Hiding Hardware Mouse : ");
                        document.getElementById("canvas").style.cursor = "none";
                        this.visible = true;
                    }
                    else {
                        if (this.traceMode)
                            CUtil_6.CUtil.trace("Showing Hardware Mouse : ");
                        document.getElementById("canvas").style.cursor = "none";
                        this.visible = false;
                    }
                }
                updateCurrentObject(evt, hitObj) {
                    if (this.traceMode)
                        (hitObj) ? CUtil_6.CUtil.trace("updateCurrentObject hitObj: " + hitObj.objID) : CUtil_6.CUtil.trace("updateCurrentObject hitObj: null");
                    let locX;
                    let locY;
                    locX = evt.stageX;
                    locY = evt.stageY;
                    if (hitObj == this.curObject)
                        return;
                    else {
                        if (this.curObject) {
                            if (this.traceMode)
                                CUtil_6.CUtil.trace("CEF Mouse Out : " + this.curObject.objID);
                            let evtOut = new CEFMouseEvent_1.CEFMouseEvent(this.curObject.objID, CEFMouseEvent_1.CEFMouseEvent.WOZOUT, evt.bubbles, evt.cancelable, evt.stageX, evt.stageY, evt.nativeEvent, evt.pointerID, evt.primary, evt.rawX, evt.rawY);
                            if (this.fLiveLog)
                                this.gLogR.logLiveEvent(evtOut.captureLogState());
                            this.curObject.dispatchEvent(evtOut);
                        }
                        this.curObject = hitObj;
                        if (this.curObject) {
                            if (this.traceMode)
                                CUtil_6.CUtil.trace("CEF Mouse Over: " + this.curObject.objID);
                            let evtOver = new CEFMouseEvent_1.CEFMouseEvent(this.curObject.objID, CEFMouseEvent_1.CEFMouseEvent.WOZOVER, evt.bubbles, evt.cancelable, evt.stageX, evt.stageY, evt.nativeEvent, evt.pointerID, evt.primary, evt.rawX, evt.rawY);
                            if (this.fLiveLog)
                                this.gLogR.logLiveEvent(evtOver.captureLogState());
                            this.curObject.dispatchEvent(evtOver);
                        }
                    }
                }
                isWOZObject(tObj) {
                    if (!tObj || tObj instanceof CEFScene_1.CEFScene)
                        return null;
                    else if (tObj instanceof CEFObject_1.CEFObject)
                        return tObj;
                    return this.isWOZObject(tObj.parent);
                }
            };
            CEFCursorProxy.WOZLIVE = "WOZLIVE";
            CEFCursorProxy.WOZREPLAY = "WOZREPLAY";
            exports_9("CEFCursorProxy", CEFCursorProxy);
        }
    };
});
System.register("core/CEFAnimator", ["core/CEFRoot", "core/CEFDoc", "util/CUtil", "events/CEFEvent"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var CEFRoot_3, CEFDoc_1, CUtil_7, CEFEvent_3, CEFAnimator;
    return {
        setters: [
            function (CEFRoot_3_1) {
                CEFRoot_3 = CEFRoot_3_1;
            },
            function (CEFDoc_1_1) {
                CEFDoc_1 = CEFDoc_1_1;
            },
            function (CUtil_7_1) {
                CUtil_7 = CUtil_7_1;
            },
            function (CEFEvent_3_1) {
                CEFEvent_3 = CEFEvent_3_1;
            }
        ],
        execute: function () {
            CEFAnimator = class CEFAnimator extends CEFRoot_3.CEFRoot {
                constructor() {
                    super(...arguments);
                    this.Running = new Array();
                    this.started = 0;
                    this.runCount = 0;
                }
                CEFAnimator() {
                }
                startTransition(xnF = null) {
                    if (this.traceMode)
                        CUtil_7.CUtil.trace("startTransition : " + this.runCount);
                    let i1;
                    this.xnFinalize = xnF;
                    if (this.Running.length == 0) {
                        this.xnCleanup();
                    }
                    for (let i1 = this.started; i1 < this.Running.length; i1++) {
                        this.runCount++;
                        this.Running[i1].addEventListener(CEFEvent_3.CEFEvent.MOTION_FINISH, this.xnFinished);
                        this.Running[i1].start();
                    }
                    this.started = this.runCount;
                    if (this.traceMode)
                        CUtil_7.CUtil.trace("Transition Running: ", this.runCount);
                }
                xnCleanup() {
                    if (this.traceMode)
                        CUtil_7.CUtil.trace("xn Flush Queue ");
                    this.stopTransitions();
                    if (this.xnFinalize != null)
                        this.xnFinalize.call(this);
                    CEFDoc_1.CEFDoc.gApp.incStateID();
                }
                xnFinished(evt) {
                    if (this.traceMode)
                        CUtil_7.CUtil.trace("xnFinished : ", this.runCount, evt.currentTarget.obj, evt.currentTarget.obj.name, evt.currentTarget.prop);
                    let targTwn = evt.currentTarget;
                    let targObj = evt.currentTarget.obj;
                    targTwn.stop();
                    targTwn.removeEventListener(CEFEvent_3.CEFEvent.MOTION_FINISH, this.xnFinished);
                    this.runCount--;
                    if (targObj.alpha == 0)
                        targObj.visible = false;
                    if (!this.runCount) {
                        this.xnCleanup();
                    }
                }
                stopTransitions() {
                    if (this.traceMode)
                        CUtil_7.CUtil.trace("stop Transition");
                    let i1;
                    let runtween;
                    while (runtween = this.Running.pop()) {
                        runtween.removeEventListener(CEFEvent_3.CEFEvent.MOTION_FINISH, this.xnFinished);
                        runtween.pause(runtween);
                    }
                    this.runCount = 0;
                    this.started = 0;
                }
            };
            exports_10("CEFAnimator", CEFAnimator);
        }
    };
});
System.register("core/CEFObjectMask", ["core/CEFObject"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var CEFObject_2, CEFObjectMask;
    return {
        setters: [
            function (CEFObject_2_1) {
                CEFObject_2 = CEFObject_2_1;
            }
        ],
        execute: function () {
            CEFObjectMask = class CEFObjectMask extends CEFObject_2.CEFObject {
                constructor() {
                    super();
                }
            };
            exports_11("CEFObjectMask", CEFObjectMask);
        }
    };
});
System.register("core/CEFTransitions", ["core/CEFRoot", "core/CEFAnimator", "core/CEFObject", "core/CEFObjectMask", "events/CEFEvent", "util/CUtil"], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var CEFRoot_4, CEFAnimator_1, CEFObject_3, CEFObjectMask_1, CEFEvent_4, CUtil_8, Tween, Ease, CEFTransitions;
    return {
        setters: [
            function (CEFRoot_4_1) {
                CEFRoot_4 = CEFRoot_4_1;
            },
            function (CEFAnimator_1_1) {
                CEFAnimator_1 = CEFAnimator_1_1;
            },
            function (CEFObject_3_1) {
                CEFObject_3 = CEFObject_3_1;
            },
            function (CEFObjectMask_1_1) {
                CEFObjectMask_1 = CEFObjectMask_1_1;
            },
            function (CEFEvent_4_1) {
                CEFEvent_4 = CEFEvent_4_1;
            },
            function (CUtil_8_1) {
                CUtil_8 = CUtil_8_1;
            }
        ],
        execute: function () {
            Tween = createjs.Tween;
            Ease = createjs.Ease;
            CEFTransitions = class CEFTransitions extends CEFAnimator_1.CEFAnimator {
                constructor() {
                    super();
                    this.currScene = "Sscene0";
                    this.newScene = null;
                    this.rTime = .25;
                    this.tTime = .25;
                    this.fSingleStep = true;
                    this.activeObjs = new Object;
                    this.persistObjs = new Object;
                    this.fSwapObjects = false;
                    this.traceMode = false;
                    if (this.traceMode)
                        CUtil_8.CUtil.trace("CEFTransitions:Constructor");
                }
                connectToTutor(parentTutor, autoTutor) {
                    this.prntTutor = parentTutor;
                    this.tutorAutoObj = autoTutor;
                    this.activeObjs = new Object;
                }
                resetTransitions() {
                    this.activeObjs = new Object;
                }
                walkTweens() {
                    let i1;
                    if (this.traceMode)
                        CUtil_8.CUtil.trace("Tween Enumeration for Scene: ", this.currScene);
                    for (i1 = 0; i1 < this.Running.length; i1++) {
                        if (this.traceMode)
                            CUtil_8.CUtil.trace("Object Value: ", this.Running[i1].obj);
                    }
                }
                gotoScene(scn) {
                    if (this.traceMode)
                        CUtil_8.CUtil.trace("Goto Scene: ", scn);
                    this.fSingleStep = false;
                    this.stopTransitions();
                    this.newScene = scn;
                    if (this.currScene != null) {
                        this.setTransitionOUT();
                        if (this.Running.length)
                            this.startTransition(this.outFinished);
                        else {
                            this.setTransitionIN(this.tutorAutoObj, this.newScene);
                            this.changeScene();
                            this.startTransition(this.inFinished);
                            if (!this.started)
                                this.inFinished();
                        }
                    }
                    else {
                        this.setTransitionIN(this.tutorAutoObj, this.newScene);
                        this.changeScene();
                        this.startTransition(this.inFinished);
                    }
                }
                setTransitionOUT() {
                    let bMatch;
                    let targObj;
                    let tween;
                    if (this.currScene != null)
                        for (let sceneObj of this.tutorAutoObj[this.currScene]) {
                            bMatch = false;
                            if (sceneObj == "instance")
                                continue;
                            if (this.newScene != null) {
                                if (this.tutorAutoObj[this.newScene][sceneObj] != undefined) {
                                    if (this.tutorAutoObj[this.currScene][sceneObj].instance instanceof CEFObject_3.CEFObject) {
                                        if (this.traceMode)
                                            CUtil_8.CUtil.trace("newObject: " + this.tutorAutoObj[this.newScene][sceneObj].instance.wozName);
                                        if (this.traceMode)
                                            CUtil_8.CUtil.trace("oldObject: " + this.tutorAutoObj[this.currScene][sceneObj].instance.wozName);
                                        if (this.tutorAutoObj[this.newScene][sceneObj].instance.wozName == this.tutorAutoObj[this.currScene][sceneObj].instance.wozName)
                                            bMatch = true;
                                    }
                                    else
                                        bMatch = true;
                                }
                            }
                            if (!bMatch) {
                                if (this.traceMode)
                                    CUtil_8.CUtil.trace("setTransitionOUT: " + this.tutorAutoObj[this.currScene][sceneObj].instance.name);
                                targObj = this.tutorAutoObj[this.currScene][sceneObj];
                                tween = new Tween(targObj.instance).to({ alpha: 0 }, Number(this.rTime), Ease.cubicInOut);
                                this.Running.push(tween);
                            }
                        }
                }
                setTransitionIN(objectList, objectName) {
                    let targObj;
                    let liveObj;
                    let tween;
                    let wozName;
                    this.currentObjs = new Array;
                    for (let namedObj of objectList[objectName]) {
                        if (namedObj != "instance") {
                            targObj = objectList[objectName][namedObj];
                            if (targObj.instance instanceof CEFObject_3.CEFObject) {
                                if (!targObj.instance.isTweenable())
                                    continue;
                                wozName = targObj.instance.wozName;
                            }
                            else
                                wozName = namedObj;
                            if (this.activeObjs[wozName] != undefined) {
                                liveObj = this.activeObjs[wozName];
                                if (this.fSwapObjects) {
                                    let dO1 = this.tutorAutoObj[this.currScene][namedObj].instance;
                                    let dO2 = this.tutorAutoObj[this.newScene][namedObj].instance;
                                    let dI1 = CEFRoot_4.CEFRoot.gTutor[this.currScene].getChildIndex(dO1);
                                    let dI2 = CEFRoot_4.CEFRoot.gTutor[this.newScene].getChildIndex(dO2);
                                    CEFRoot_4.CEFRoot.gTutor[this.currScene].addChildAt(dO2, dI1);
                                    CEFRoot_4.CEFRoot.gTutor[this.newScene].addChildAt(dO1, dI2);
                                    this.tutorAutoObj[this.currScene][namedObj].instance = dO2;
                                    this.tutorAutoObj[this.newScene][namedObj].instance = dO1;
                                    targObj = objectList[objectName][namedObj];
                                }
                                else {
                                    if ((liveObj instanceof CEFObject_3.CEFObject) && (targObj.instance.tweenID == liveObj.tweenID)) {
                                        targObj.instance.deepStateCopy(liveObj);
                                    }
                                    else
                                        this.shallowStateCopy(targObj.instance, liveObj);
                                }
                                if (targObj.inPlace.X != liveObj.x) {
                                    tween = new Tween(targObj.instance).to({ x: targObj.inPlace.X }, this.tTime, Ease.cubicInOut);
                                    if (this.traceMode)
                                        CUtil_8.CUtil.trace("Tweening obj in scene: " + objectName + "  named : " + targObj.name + " property: " + targObj.prop + " in: " + tween.duration + "secs");
                                    this.Running.push(tween);
                                }
                                if (targObj.inPlace.Y != liveObj.y) {
                                    tween = new Tween(targObj.instance).to({ y: targObj.inPlace.Y }, this.tTime, Ease.cubicInOut);
                                    if (this.traceMode)
                                        CUtil_8.CUtil.trace("Tweening obj in scene: " + objectName + "  named : " + targObj.name + " property: " + targObj.prop + " in: " + tween.duration + "secs");
                                    this.Running.push(tween);
                                }
                                if (targObj.inPlace.Alpha != liveObj.alpha) {
                                    tween = new Tween(targObj.instance).to({ alpha: targObj.inPlace.Alpha }, this.tTime, Ease.cubicInOut);
                                    if (this.traceMode)
                                        CUtil_8.CUtil.trace("Tweening obj in scene: " + objectName + "  named : " + targObj.name + " property: " + targObj.prop + " in: " + tween.duration + "secs");
                                    this.Running.push(tween);
                                }
                            }
                            else {
                                if (!(targObj.instance instanceof CEFObjectMask_1.CEFObjectMask))
                                    targObj.instance.alpha = 0;
                                tween = new Tween(targObj.instance).to({ alpha: targObj.inPlace.Alpha }, this.tTime, Ease.cubicInOut);
                                if (this.traceMode)
                                    CUtil_8.CUtil.trace("Tweening obj in scene: " + objectName + "  named : " + targObj.name + " property: " + targObj.prop + " in: " + tween.duration + "secs");
                                this.Running.push(tween);
                            }
                            if (targObj.instance instanceof CEFObject_3.CEFObject) {
                                if (!targObj.instance.hidden)
                                    targObj.instance.visible = true;
                                if (targObj.instance.bPersist) {
                                    this.persistObjs[wozName] = targObj.instance;
                                }
                                else {
                                    this.currentObjs.push(new Array(wozName, targObj.instance));
                                }
                                if (targObj.instance.isSubTweenable()) {
                                    if (this.traceMode)
                                        CUtil_8.CUtil.trace("SubTweening : " + targObj.instance.name);
                                    this.setTransitionIN(objectList[objectName], namedObj);
                                }
                            }
                            else {
                                targObj.instance.visible = true;
                                this.currentObjs.push(new Array(wozName, targObj.instance));
                            }
                        }
                    }
                    this.activeObjs = new Object;
                    for (let objRec of this.currentObjs) {
                        this.activeObjs[objRec[0]] = objRec[1];
                    }
                    for (let perObj of this.persistObjs) {
                        this.activeObjs[perObj.wozName] = perObj;
                    }
                }
                changeScene() {
                    this.tutorAutoObj[this.currScene].instance.visible = false;
                    this.tutorAutoObj[this.newScene].instance.visible = true;
                    this.currScene = this.newScene;
                }
                shallowStateCopy(tar, src) {
                    tar.x = src.x;
                    tar.y = src.y;
                    tar.alpha = src.alpha;
                }
                xnFinished(evt) {
                    if (evt.currentTarget.obj.alpha == 0)
                        evt.currentTarget.obj.visible = false;
                    super.xnFinished(evt);
                }
                outFinished() {
                    CUtil_8.CUtil.trace("outFinished");
                    if (!this.fSingleStep) {
                        if (this.newScene) {
                            if (this.tutorAutoObj[this.newScene].instance.visible == false) {
                                this.setTransitionIN(this.tutorAutoObj, this.newScene);
                            }
                            this.changeScene();
                            this.startTransition(this.inFinished);
                        }
                    }
                    else
                        this.dispatchEvent(new Event(CEFEvent_4.CEFEvent.CHANGE));
                }
                inFinished() {
                    CUtil_8.CUtil.trace("inFinished");
                    this.currScene = this.newScene;
                    this.dispatchEvent(new Event(CEFEvent_4.CEFEvent.COMPLETE));
                }
            };
            exports_12("CEFTransitions", CEFTransitions);
        }
    };
});
System.register("core/CEFButton", ["core/CEFRoot", "core/CEFObject", "events/CEFMouseEvent", "util/CUtil"], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var CEFRoot_5, CEFObject_4, CEFMouseEvent_2, CUtil_9, CEFButton;
    return {
        setters: [
            function (CEFRoot_5_1) {
                CEFRoot_5 = CEFRoot_5_1;
            },
            function (CEFObject_4_1) {
                CEFObject_4 = CEFObject_4_1;
            },
            function (CEFMouseEvent_2_1) {
                CEFMouseEvent_2 = CEFMouseEvent_2_1;
            },
            function (CUtil_9_1) {
                CUtil_9 = CUtil_9_1;
            }
        ],
        execute: function () {
            CEFButton = class CEFButton extends CEFObject_4.CEFObject {
                constructor() {
                    super();
                    this.curState = "Sup";
                    this.fPressed = false;
                    this.fEnabled = true;
                    this.fOver = false;
                    this.onClickScript = null;
                    this.traceMode = false;
                    if (this.traceMode)
                        CUtil_9.CUtil.trace("CEFButton:Constructor");
                    this.gotoState("Sup");
                    this.enableButton(true);
                }
                Destructor() {
                    this.removeEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZCLICKED, this.doMouseClicked);
                    this.removeEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZOVER, this.doMouseOver);
                    this.removeEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZOUT, this.doMouseOut);
                    this.removeEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZDOWN, this.doMouseDown);
                    this.removeEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZUP, this.doMouseUp);
                    super.Destructor();
                }
                captureDefState(TutScene) {
                    super.captureDefState(TutScene);
                }
                restoreDefState(TutScene) {
                    if (this.traceMode)
                        CUtil_9.CUtil.trace("Button Reseting: " + name);
                    this.curState = "unknown";
                    this.fPressed = false;
                    this.fEnabled = true;
                    this.fOver = false;
                    this.enableButton(true);
                    super.restoreDefState(TutScene);
                }
                captureLogState(obj = null) {
                    obj = super.captureLogState(obj);
                    obj['target'] = 'button';
                    obj['name'] = name;
                    obj['state'] = this.curState;
                    obj['pressed'] = this.fPressed.toString();
                    obj['enabled'] = this.fEnabled.toString();
                    obj['over'] = this.fOver.toString();
                    return obj;
                }
                capturestringState() {
                    let stringVal = "<button name={name} state={curState} pressed={fPressed.toString()} enabled={fEnabled.toString()} over={fOver.toString()}/>";
                    return stringVal;
                }
                resetState() {
                    this["Sup"].visible = true;
                    this["Sover"].visible = false;
                    this["Sdown"].visible = false;
                    this["Sdisabled"].visible = false;
                    this["Sfocus"].visible = false;
                }
                gotoState(sState) {
                    if (this.traceMode)
                        CUtil_9.CUtil.trace("CEFButton.gotoState: ", name + " " + sState);
                    this.resetState();
                    this.curState = sState;
                    if (!this.fEnabled) {
                        this["Sover"].visible = false;
                        this["Sup"].visible = false;
                        this["Sdisabled"].visible = true;
                        this.fPressed = false;
                    }
                    else
                        switch (sState) {
                            case "Sdown":
                                this["Sdown"].visible = true;
                                this.fPressed = true;
                                break;
                            case "Sup":
                                if (this.fOver)
                                    this["Sover"].visible = true;
                                else
                                    this["Sup"].visible = true;
                                this.fPressed = false;
                                break;
                            case "Sover":
                                if (!this.fPressed)
                                    this["Sover"].visible = true;
                                else
                                    this["Sdown"].visible = true;
                                this.fOver = true;
                                break;
                            case "Sout":
                                this["Sup"].visible = true;
                                this.fOver = false;
                                break;
                        }
                }
                muteButton(bMute) {
                    if (bMute) {
                        if (this.traceMode)
                            CUtil_9.CUtil.trace("Button Muted: " + name);
                        this.removeEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZCLICKED, this.doMouseClicked);
                        this.removeEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZOVER, this.doMouseOver);
                        this.removeEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZOUT, this.doMouseOut);
                        this.removeEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZDOWN, this.doMouseDown);
                        this.removeEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZUP, this.doMouseUp);
                    }
                    else {
                        if (this.traceMode)
                            CUtil_9.CUtil.trace("Button UnMuted: " + name);
                        this.addEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZCLICKED, this.doMouseClicked);
                        this.addEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZOVER, this.doMouseOver);
                        this.addEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZOUT, this.doMouseOut);
                        this.addEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZDOWN, this.doMouseDown);
                        this.addEventListener(CEFMouseEvent_2.CEFMouseEvent.WOZUP, this.doMouseUp);
                    }
                }
                enableButton(bFlag) {
                    this.fEnabled = bFlag;
                    if (!bFlag) {
                        if (this.traceMode)
                            CUtil_9.CUtil.trace("Button Disabled: " + name);
                        this.gotoState(this.curState);
                        this.muteButton(true);
                    }
                    else {
                        if (this.traceMode)
                            CUtil_9.CUtil.trace("Button Enabled: " + name);
                        this.gotoState(this.curState);
                        this.muteButton(false);
                    }
                }
                doMouseClicked(evt) {
                    if (this.traceMode)
                        CUtil_9.CUtil.trace("dispatch WOZCLICK");
                    this.dispatchEvent(new CEFMouseEvent_2.CEFMouseEvent("", CEFMouseEvent_2.CEFMouseEvent.WOZCLICK, evt.bubbles, evt.cancelable, evt.stageX, evt.stageY, evt.nativeEvent, evt.pointerID, evt.primary, evt.rawX, evt.rawY));
                    if (this.onClickScript != null)
                        this.doClickAction(evt);
                    let logData = { 'action': 'button_click', 'targetid': name };
                    this.gLogR.logActionEvent(logData);
                }
                doClickAction(evt) {
                    try {
                    }
                    catch (e) {
                        CUtil_9.CUtil.trace("Error in onClick script: " + this.onClickScript);
                    }
                }
                doMouseOver(evt) {
                    this.gotoState("Sover");
                }
                doMouseOut(evt) {
                    this.gotoState("Sout");
                }
                doMouseDown(evt) {
                    this.gotoState("Sdown");
                }
                doMouseUp(evt) {
                    this.gotoState("Sup");
                }
                showButton(fShow) {
                    this.visible = fShow;
                    if (fShow) {
                        if (this.traceMode)
                            CUtil_9.CUtil.trace("testing init state: " + name);
                        try {
                            if (CEFRoot_5.CEFRoot.gTutor.cCursor.stateHelper(this)) {
                                if (this.traceMode)
                                    CUtil_9.CUtil.trace("setting init state Over");
                                this.doMouseOver(null);
                            }
                        }
                        catch (Error) {
                            if (this.traceMode)
                                CUtil_9.CUtil.trace("cCursor not yet instantiated");
                        }
                    }
                }
                loadXML(stringSrc) {
                    super.loadXML(stringSrc);
                    if (stringSrc.onclick != undefined) {
                    }
                }
                saveXML() {
                    let propVector;
                    return propVector;
                }
            };
            exports_13("CEFButton", CEFButton);
        }
    };
});
System.register("navigation/CEFNavNext", ["core/CEFButton"], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var CEFButton_1, CEFNavNext;
    return {
        setters: [
            function (CEFButton_1_1) {
                CEFButton_1 = CEFButton_1_1;
            }
        ],
        execute: function () {
            CEFNavNext = class CEFNavNext extends CEFButton_1.CEFButton {
                constructor() {
                    super();
                }
            };
            exports_14("CEFNavNext", CEFNavNext);
        }
    };
});
System.register("navigation/CEFZNavBack", ["core/CEFButton"], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var CEFButton_2, CEFNavBack;
    return {
        setters: [
            function (CEFButton_2_1) {
                CEFButton_2 = CEFButton_2_1;
            }
        ],
        execute: function () {
            CEFNavBack = class CEFNavBack extends CEFButton_2.CEFButton {
                constructor() {
                    super();
                }
            };
            exports_15("CEFNavBack", CEFNavBack);
        }
    };
});
System.register("events/CEFTimerEvent", [], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var Event, CEFTimerEvent;
    return {
        setters: [],
        execute: function () {
            Event = createjs.Event;
            CEFTimerEvent = class CEFTimerEvent extends Event {
                constructor(type, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                }
            };
            CEFTimerEvent.TIMER_COMPLETE = "complete";
            exports_16("CEFTimerEvent", CEFTimerEvent);
        }
    };
});
System.register("core/CEFTimer", ["core/CEFRoot", "events/CEFTimerEvent", "util/CUtil"], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var CEFRoot_6, CEFTimerEvent_1, CUtil_10, EventDispatcher, CEFTimer;
    return {
        setters: [
            function (CEFRoot_6_1) {
                CEFRoot_6 = CEFRoot_6_1;
            },
            function (CEFTimerEvent_1_1) {
                CEFTimerEvent_1 = CEFTimerEvent_1_1;
            },
            function (CUtil_10_1) {
                CUtil_10 = CUtil_10_1;
            }
        ],
        execute: function () {
            EventDispatcher = createjs.EventDispatcher;
            CEFTimer = class CEFTimer extends EventDispatcher {
                constructor(delay, repeatCount = 0) {
                    super();
                    this.traceMode = false;
                    this._delay = delay;
                    this._repeatCount = repeatCount;
                }
                cancelTimers(evt) {
                    if (this.traceMode)
                        CUtil_10.CUtil.trace(" cancelTimers : " + CEFTimer.activeTimers.length);
                    var tCount = CEFTimer.activeTimers.length;
                    for (var i1 = 0; i1 < tCount; i1++) {
                        CEFTimer.activeTimers[0].stop();
                        CEFTimer.activeTimers.pop();
                    }
                }
                pauseTimers(evt) {
                    if (this.traceMode)
                        CUtil_10.CUtil.trace(" pauseTimers : " + CEFTimer.activeTimers.length);
                    for (var i1 = 0; i1 < CEFTimer.activeTimers.length; i1++) {
                        CEFTimer.activeTimers[i1].stop();
                    }
                }
                playTimers(evt) {
                    if (this.traceMode)
                        CUtil_10.CUtil.trace(" playTimers : " + CEFTimer.activeTimers.length);
                    for (var i1 = 0; i1 < CEFTimer.activeTimers.length; i1++) {
                        CEFTimer.activeTimers[i1].start();
                    }
                }
                timerRemoveThis() {
                    if (this.traceMode)
                        CUtil_10.CUtil.trace(" timerRemoveThis : ");
                    for (var i1 = 0; i1 < CEFTimer.activeTimers.length; i1++) {
                        if (CEFTimer.activeTimers[i1] == this) {
                            CEFTimer.activeTimers.splice(i1, 1);
                            break;
                        }
                    }
                }
                timerAddThis() {
                    if (this.traceMode)
                        CUtil_10.CUtil.trace(" timerAddThis : ");
                    var fAdd = true;
                    for (var i1 = 0; i1 < CEFTimer.activeTimers.length; i1++) {
                        if (CEFTimer.activeTimers[i1] == this) {
                            fAdd = false;
                            break;
                        }
                    }
                    if (fAdd)
                        CEFTimer.activeTimers.push(this);
                }
                reset() {
                    if (this.traceMode)
                        CUtil_10.CUtil.trace(" is resetting");
                    this.timerRemoveThis();
                }
                start() {
                    if (this.traceMode)
                        CUtil_10.CUtil.trace(" Timer is starting");
                    if (CEFRoot_6.CEFRoot.gTutor) {
                        CEFRoot_6.CEFRoot.gTutor.addEventListener(CEFRoot_6.CEFRoot.WOZCANCEL, this.cancelTimers);
                        CEFRoot_6.CEFRoot.gTutor.addEventListener(CEFRoot_6.CEFRoot.WOZPAUSING, this.pauseTimers);
                        CEFRoot_6.CEFRoot.gTutor.addEventListener(CEFRoot_6.CEFRoot.WOZPLAYING, this.playTimers);
                        this.timerAddThis();
                        this.addEventListener(CEFTimerEvent_1.CEFTimerEvent.TIMER_COMPLETE, this.timerFinished);
                    }
                }
                timerFinished(evt) {
                    this.timerRemoveThis();
                    this.removeEventListener(CEFTimerEvent_1.CEFTimerEvent.TIMER_COMPLETE, this.timerFinished);
                }
                stop() {
                    if (this.traceMode)
                        CUtil_10.CUtil.trace(" Timer is stopping");
                    if (CEFRoot_6.CEFRoot.gTutor) {
                        CEFRoot_6.CEFRoot.gTutor.removeEventListener(CEFRoot_6.CEFRoot.WOZCANCEL, this.cancelTimers);
                        CEFRoot_6.CEFRoot.gTutor.removeEventListener(CEFRoot_6.CEFRoot.WOZPAUSING, this.pauseTimers);
                        CEFRoot_6.CEFRoot.gTutor.removeEventListener(CEFRoot_6.CEFRoot.WOZPLAYING, this.playTimers);
                        this.timerRemoveThis();
                        this.removeEventListener(CEFTimerEvent_1.CEFTimerEvent.TIMER_COMPLETE, this.timerFinished);
                    }
                }
            };
            CEFTimer.activeTimers = new Array();
            exports_17("CEFTimer", CEFTimer);
        }
    };
});
System.register("events/CEFNavEvent", ["util/CUtil"], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var CUtil_11, Event, CEFNavEvent;
    return {
        setters: [
            function (CUtil_11_1) {
                CUtil_11 = CUtil_11_1;
            }
        ],
        execute: function () {
            Event = createjs.Event;
            CEFNavEvent = class CEFNavEvent extends Event {
                constructor(type, _target = null, _featureSet = null, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                    this.wozNavTarget = _target;
                    this.wozFeatures = _featureSet;
                }
                clone() {
                    CUtil_11.CUtil.trace("cloning WOZEvent:");
                    return new CEFNavEvent(this.type, this.wozNavTarget, this.wozFeatures, this.bubbles, this.cancelable);
                }
            };
            CEFNavEvent.WOZNAVNEXT = "WOZNAVNEXT";
            CEFNavEvent.WOZNAVBACK = "WOZNAVBACK";
            CEFNavEvent.WOZNAVTO = "WOZNAVTO";
            CEFNavEvent.WOZNAVINC = "WOZNAVINC";
            CEFNavEvent.WOZNAVREPLAY = "WOZNAVREPLAY";
            exports_18("CEFNavEvent", CEFNavEvent);
        }
    };
});
System.register("animationgraph/CAnimationConstraint", ["core/CEFRoot", "util/CUtil"], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var CEFRoot_7, CUtil_12, CAnimationConstraint;
    return {
        setters: [
            function (CEFRoot_7_1) {
                CEFRoot_7 = CEFRoot_7_1;
            },
            function (CUtil_12_1) {
                CUtil_12 = CUtil_12_1;
            }
        ],
        execute: function () {
            CAnimationConstraint = class CAnimationConstraint extends Object {
                constructor() {
                    super();
                }
                static factory(parent, factory) {
                    let node = new CAnimationConstraint;
                    node._parent = parent;
                    node._cmd = factory.cmd;
                    node._code = factory.code;
                    return node;
                }
                execute() {
                    let result = false;
                    let sresult = "";
                    switch (this._cmd) {
                        case "test":
                            result = CEFRoot_7.CEFRoot.gTutor.testFeatureSet(this._code);
                            sresult = result ? " :passed." : " :failed.";
                            CUtil_12.CUtil.trace("Animation Constraint: " + this._code + sresult);
                            break;
                        case "exec":
                            CUtil_12.CUtil.trace("R0 Belief: " + CEFRoot_7.CEFRoot.gTutor.ktSkills['rule0'].queryBelief());
                            break;
                    }
                    return result;
                }
            };
            exports_19("CAnimationConstraint", CAnimationConstraint);
        }
    };
});
System.register("animationgraph/CAnimationEdge", [], function (exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var CAnimationEdge;
    return {
        setters: [],
        execute: function () {
            CAnimationEdge = class CAnimationEdge {
                constructor() {
                }
                static factory(parent, factory) {
                    let edge = new CAnimationEdge;
                    edge._parent = parent;
                    edge._edgeConst = factory.constraint;
                    edge._edgeNode = factory.edge;
                    return edge;
                }
                testConstraint() {
                    let result = true;
                    let constraint = this._parent.findConstraintByName(this._edgeConst);
                    if (constraint != null)
                        result = constraint.execute();
                    return result;
                }
                followEdge() {
                    return this._parent.findNodeByName(this._edgeNode);
                }
            };
            exports_20("CAnimationEdge", CAnimationEdge);
        }
    };
});
System.register("animationgraph/CAnimationNode", ["animationgraph/CAnimationEdge"], function (exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var CAnimationEdge_1, EventDispatcher, CAnimationNode;
    return {
        setters: [
            function (CAnimationEdge_1_1) {
                CAnimationEdge_1 = CAnimationEdge_1_1;
            }
        ],
        execute: function () {
            EventDispatcher = createjs.EventDispatcher;
            CAnimationNode = class CAnimationNode extends EventDispatcher {
                constructor(target = null) {
                    super();
                    this._edges = new Array;
                }
                nodeFactory(parent, id, nodefactory) {
                    this._parent = parent;
                    this._id = id;
                    this._type = nodefactory.type;
                    this._name = nodefactory.name;
                    this._preEnter = nodefactory.preenter;
                    this._preExit = nodefactory.preexit;
                    if (this._preEnter == "")
                        this._preEnter = null;
                    if (this._preExit == "")
                        this._preExit = null;
                    for (let edge of nodefactory.edges) {
                        this._edges.push(CAnimationEdge_1.CAnimationEdge.factory(parent, edge));
                    }
                }
                nextAnimation() {
                    return null;
                }
                nextNode() {
                    let edge;
                    let node = null;
                    if (this._preExit != null) {
                    }
                    for (edge of this._edges) {
                        if (edge.testConstraint()) {
                            node = edge.followEdge();
                            if (node != null && node._preEnter != null) {
                            }
                            break;
                        }
                    }
                    return node;
                }
                preEnter() {
                    if (this._preEnter != null) {
                    }
                }
                seekToAnimation(seek) {
                    return null;
                }
                applyNode() {
                    return false;
                }
                resetNode() {
                }
            };
            exports_21("CAnimationNode", CAnimationNode);
        }
    };
});
System.register("animationgraph/CAnimationAction", ["animationgraph/CAnimationNode", "core/CEFRoot"], function (exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var CAnimationNode_1, CEFRoot_8, CAnimationAction;
    return {
        setters: [
            function (CAnimationNode_1_1) {
                CAnimationNode_1 = CAnimationNode_1_1;
            },
            function (CEFRoot_8_1) {
                CEFRoot_8 = CEFRoot_8_1;
            }
        ],
        execute: function () {
            CAnimationAction = class CAnimationAction extends CAnimationNode_1.CAnimationNode {
                constructor(target = null) {
                    super(target);
                }
                static factory(parent, nodeName, moduleFactory) {
                    let node = new CAnimationAction;
                    if (moduleFactory.type == "node") {
                        node.nodeFactory(parent, nodeName, moduleFactory);
                        moduleFactory = parent._graphFactory.CActions[node._name];
                    }
                    node._cmd = moduleFactory.cmd;
                    node._code = moduleFactory.code;
                    return node;
                }
                nextAnimation() {
                    return null;
                }
                applyNode() {
                    let result = false;
                    switch (this._cmd) {
                        case "test":
                            result = CEFRoot_8.CEFRoot.gTutor.testFeatureSet(this._code);
                            break;
                        case "exec":
                            break;
                    }
                    return result;
                }
            };
            exports_22("CAnimationAction", CAnimationAction);
        }
    };
});
System.register("animationgraph/CAnimationChoice", [], function (exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var CAnimationChoice;
    return {
        setters: [],
        execute: function () {
            CAnimationChoice = class CAnimationChoice {
                constructor(data) {
                    this._chosen = false;
                    this._classname = data.classname;
                    this._odds = data.odds.split('.');
                }
                odds(ndx) {
                    let result;
                    if (this._chosen)
                        result = 0;
                    else
                        result = this._odds[ndx];
                    return result;
                }
                get count() {
                    return this._odds.length;
                }
                get classname() {
                    return this._classname;
                }
                replace() {
                    this._chosen = false;
                }
                choose() {
                    this._chosen = true;
                }
            };
            exports_23("CAnimationChoice", CAnimationChoice);
        }
    };
});
System.register("animationgraph/CAnimationChoiceSet", ["animationgraph/CAnimationNode", "animationgraph/CAnimationChoice"], function (exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var CAnimationNode_2, CAnimationChoice_1, CAnimationChoiceSet;
    return {
        setters: [
            function (CAnimationNode_2_1) {
                CAnimationNode_2 = CAnimationNode_2_1;
            },
            function (CAnimationChoice_1_1) {
                CAnimationChoice_1 = CAnimationChoice_1_1;
            }
        ],
        execute: function () {
            CAnimationChoiceSet = class CAnimationChoiceSet extends CAnimationNode_2.CAnimationNode {
                constructor(target = null) {
                    super(target);
                    this._choices = new Array;
                    this._iter = 0;
                    this._replace = true;
                }
                static factory(parent, nodeName, moduleFactory) {
                    let node = new CAnimationChoiceSet;
                    if (moduleFactory.type == "node") {
                        node.nodeFactory(parent, nodeName, moduleFactory);
                        moduleFactory = parent._graphFactory.CChoiceSets[node._name];
                    }
                    let choices = moduleFactory.choices;
                    for (let set in choices) {
                        node._choices.push(new CAnimationChoice_1.CAnimationChoice(set));
                    }
                    node._replace = moduleFactory.replace;
                    node._cycle = Number(moduleFactory.cycle);
                    node._count = node._choices[0].count;
                    return node;
                }
                nextAnimation() {
                    let nextTrackClass = null;
                    let choice;
                    let curOdds = 0;
                    let sampleSize;
                    let rand;
                    do {
                        for (let choice of this._choices) {
                            sampleSize += choice.odds(this._iter);
                        }
                        if (sampleSize == 0) {
                            for (choice of this._choices) {
                                choice.replace();
                            }
                        }
                    } while (sampleSize == 0);
                    rand = Math.floor(Math.random() * sampleSize);
                    for (let choice of this._choices) {
                        curOdds += choice.odds(this._iter);
                        if (rand < curOdds) {
                            nextTrackClass = choice.classname;
                            if (!this._replace)
                                choice.choose();
                            this._iter++;
                            if (this._iter >= this._count) {
                                this._iter = this._count - this._cycle;
                            }
                            break;
                        }
                    }
                    return nextTrackClass;
                }
            };
            exports_24("CAnimationChoiceSet", CAnimationChoiceSet);
        }
    };
});
System.register("animationgraph/CAnimationTrack", ["animationgraph/CAnimationChoiceSet"], function (exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var CAnimationChoiceSet_1, CAnimationTrack;
    return {
        setters: [
            function (CAnimationChoiceSet_1_1) {
                CAnimationChoiceSet_1 = CAnimationChoiceSet_1_1;
            }
        ],
        execute: function () {
            CAnimationTrack = class CAnimationTrack {
                constructor(factory, parent) {
                    this._parent = parent;
                    if (factory.choiceset != undefined) {
                        this._type = 'choiceset';
                        this._choiceset = CAnimationChoiceSet_1.CAnimationChoiceSet.factory(this._parent, factory.choiceset, this._parent._graphFactory.CChoiceSets[factory.choiceset]);
                    }
                    else if (factory.classname != undefined) {
                        this._type = 'actiontrack';
                        this._classname = factory.classname;
                    }
                    this._features = factory.features;
                    if (factory.$P != undefined) {
                        this._pid = factory.pid;
                        this._prob = factory.$P.split('|');
                        this._cycle = Number(factory.cycle);
                    }
                }
                nextAnimation() {
                    return this._choiceset.nextAnimation();
                }
                testPFeature() {
                    let iter = this._parent.queryPFeature(this._pid, this._prob.length, this._cycle);
                    let rand = Math.random();
                    return (rand < this._prob[iter]);
                }
                get hasPFeature() {
                    return (this._pid != null);
                }
                get type() {
                    return this._type;
                }
                set features(newFTR) {
                    this._features = newFTR;
                }
                get features() {
                    return this._features;
                }
                get classname() {
                    return this._classname;
                }
            };
            exports_25("CAnimationTrack", CAnimationTrack);
        }
    };
});
System.register("animationgraph/CAnimationModule", ["animationgraph/CAnimationNode", "animationgraph/CAnimationTrack", "core/CEFRoot", "util/CUtil"], function (exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var CAnimationNode_3, CAnimationTrack_1, CEFRoot_9, CUtil_13, CAnimationModule;
    return {
        setters: [
            function (CAnimationNode_3_1) {
                CAnimationNode_3 = CAnimationNode_3_1;
            },
            function (CAnimationTrack_1_1) {
                CAnimationTrack_1 = CAnimationTrack_1_1;
            },
            function (CEFRoot_9_1) {
                CEFRoot_9 = CEFRoot_9_1;
            },
            function (CUtil_13_1) {
                CUtil_13 = CUtil_13_1;
            }
        ],
        execute: function () {
            CAnimationModule = class CAnimationModule extends CAnimationNode_3.CAnimationNode {
                constructor(target = null) {
                    super(target);
                    this._animations = new Array;
                    this._ndx = -1;
                }
                static factory(parent, nodeName, moduleFactory) {
                    let node = new CAnimationModule;
                    if (moduleFactory.type == "node") {
                        node.nodeFactory(parent, nodeName, moduleFactory);
                        moduleFactory = parent._graphFactory.CModules[node._name];
                    }
                    node._reuse = moduleFactory.reuse;
                    let actiontracks = moduleFactory.actiontracks;
                    for (let track in actiontracks) {
                        node._animations.push(new CAnimationTrack_1.CAnimationTrack(track, parent));
                    }
                    return node;
                }
                nextAnimation() {
                    let nextTrackClass = null;
                    let nextAnimation;
                    let features;
                    let featurePass = false;
                    while (this._ndx < this._animations.length) {
                        this._ndx++;
                        nextAnimation = this._animations[this._ndx];
                        nextTrackClass = null;
                        if (nextAnimation != null) {
                            features = nextAnimation.features;
                            if (features != "") {
                                featurePass = CEFRoot_9.CEFRoot.gTutor.testFeatureSet(features);
                                if (featurePass) {
                                    if (nextAnimation.hasPFeature) {
                                        featurePass = nextAnimation.testPFeature();
                                    }
                                }
                            }
                            else {
                                if (nextAnimation.hasPFeature) {
                                    featurePass = nextAnimation.testPFeature();
                                }
                                else
                                    featurePass = true;
                            }
                            if (featurePass) {
                                CUtil_13.CUtil.trace("Animation Feature: " + features + " passed:" + featurePass);
                                switch (nextAnimation.type) {
                                    case "actiontrack":
                                        nextTrackClass = nextAnimation.classname;
                                        break;
                                    case "choiceset":
                                        nextTrackClass = nextAnimation.nextAnimation();
                                        break;
                                }
                                break;
                            }
                        }
                        else
                            break;
                    }
                    if (this._ndx >= this._animations.length) {
                        if (this._reuse) {
                            this.resetNode();
                        }
                    }
                    return nextTrackClass;
                }
                seekToAnimation(seek) {
                    let animation = null;
                    let ndx = 0;
                    for (let animation of this._animations) {
                        if (seek == animation.classname) {
                            this._ndx = ndx;
                            break;
                        }
                        ndx++;
                    }
                    return animation.classname;
                }
                applyNode() {
                    return false;
                }
                resetNode() {
                    this._ndx = -1;
                }
            };
            exports_26("CAnimationModule", CAnimationModule);
        }
    };
});
System.register("animationgraph/CAnimationGraph", ["animationgraph/CAnimationNode", "animationgraph/CAnimationAction", "animationgraph/CAnimationModule", "animationgraph/CAnimationChoiceSet", "animationgraph/CAnimationConstraint", "core/CEFRoot"], function (exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var CAnimationNode_4, CAnimationAction_1, CAnimationModule_1, CAnimationChoiceSet_2, CAnimationConstraint_1, CEFRoot_10, CAnimationGraph;
    return {
        setters: [
            function (CAnimationNode_4_1) {
                CAnimationNode_4 = CAnimationNode_4_1;
            },
            function (CAnimationAction_1_1) {
                CAnimationAction_1 = CAnimationAction_1_1;
            },
            function (CAnimationModule_1_1) {
                CAnimationModule_1 = CAnimationModule_1_1;
            },
            function (CAnimationChoiceSet_2_1) {
                CAnimationChoiceSet_2 = CAnimationChoiceSet_2_1;
            },
            function (CAnimationConstraint_1_1) {
                CAnimationConstraint_1 = CAnimationConstraint_1_1;
            },
            function (CEFRoot_10_1) {
                CEFRoot_10 = CEFRoot_10_1;
            }
        ],
        execute: function () {
            CAnimationGraph = class CAnimationGraph extends CAnimationNode_4.CAnimationNode {
                constructor() {
                    super(...arguments);
                    this._nodes = new Object;
                    this._modules = new Object;
                    this._choicesets = new Object;
                    this._actions = new Object;
                    this._graphs = new Object;
                    this._constraints = new Object;
                }
                CAnimationGraph() {
                }
                static factory(parent, id, factoryName) {
                    let animationgraph = new CAnimationGraph;
                    animationgraph._graphFactory = CEFRoot_10.CEFRoot.gAnimationGraphDesc[factoryName];
                    animationgraph.sceneInstance = parent;
                    animationgraph.parseModules();
                    animationgraph.parseActions();
                    animationgraph.parseChoiceSets();
                    animationgraph.parseConstraints();
                    animationgraph.parseNodes();
                    animationgraph.seekRoot();
                    return animationgraph;
                }
                seekRoot() {
                    this._currNode = this._nodes["root"];
                }
                onEnterRoot() {
                    this._currNode.preEnter();
                }
                get sceneInstance() {
                    return this._parentScene;
                }
                set sceneInstance(scene) {
                    this._parentScene = scene;
                }
                queryPFeature(pid, size, cycle) {
                    let iter = 0;
                    if (CAnimationGraph._pFeatures[pid] != undefined) {
                        iter = CAnimationGraph._pFeatures[pid] + 1;
                        if (iter >= size) {
                            iter = size - cycle;
                        }
                        CAnimationGraph._pFeatures[pid] = iter;
                    }
                    else
                        CAnimationGraph._pFeatures[pid] = 0;
                    return iter;
                }
                nextAnimation() {
                    let nextNode;
                    if (this._currNode)
                        do {
                            this._currAnimation = this._currNode.nextAnimation();
                            if (this._currAnimation == null) {
                                this._currNode = this._currNode.nextNode();
                                if (this._currNode) {
                                    this._currNode.applyNode();
                                }
                            }
                        } while ((this._currAnimation == null) && (this._currNode != null));
                    this._prevAnimation = this._currAnimation;
                    return this._currAnimation;
                }
                parseNodes() {
                    let nodeList = this._graphFactory.CNodes;
                    for (let name in nodeList) {
                        if (name != "COMMENT") {
                            switch (nodeList[name].subtype) {
                                case "action":
                                    this._nodes[name] = CAnimationAction_1.CAnimationAction.factory(this, name, nodeList[name]);
                                    break;
                                case "module":
                                    this._nodes[name] = CAnimationModule_1.CAnimationModule.factory(this, name, nodeList[name]);
                                    break;
                                case "choiceset":
                                    this._nodes[name] = CAnimationChoiceSet_2.CAnimationChoiceSet.factory(this, name, nodeList[name]);
                                    break;
                            }
                        }
                    }
                    return true;
                }
                parseModules() {
                    let moduleFactory = this._graphFactory.CModules;
                    for (let name in moduleFactory) {
                        if (name != "COMMENT")
                            this._modules[name] = CAnimationModule_1.CAnimationModule.factory(this, name, moduleFactory[name]);
                    }
                    return true;
                }
                parseActions() {
                    let actionFactory = this._graphFactory.CActions;
                    for (let name in actionFactory) {
                        if (name != "COMMENT")
                            this._actions[name] = CAnimationAction_1.CAnimationAction.factory(this, name, actionFactory[name]);
                    }
                    return true;
                }
                parseChoiceSets() {
                    let choicesetFactory = this._graphFactory.CChoiceSets;
                    for (let name in choicesetFactory) {
                        if (name != "COMMENT")
                            this._choicesets[name] = CAnimationChoiceSet_2.CAnimationChoiceSet.factory(this, name, choicesetFactory[name]);
                    }
                    return true;
                }
                parseConstraints() {
                    let constraintFactory = this._graphFactory.CConstraints;
                    for (let name in constraintFactory) {
                        if (name != "COMMENT")
                            this._constraints[name] = CAnimationConstraint_1.CAnimationConstraint.factory(this, constraintFactory[name]);
                    }
                    return true;
                }
                findNodeByName(name) {
                    return this._nodes[name];
                }
                findConstraintByName(name) {
                    return this._constraints[name];
                }
                get node() {
                    return this._currNode;
                }
                set node(newNode) {
                    if (this._currNode != newNode)
                        this._currNode.resetNode();
                    this._currNode = newNode;
                }
            };
            CAnimationGraph._pFeatures = new Object;
            exports_27("CAnimationGraph", CAnimationGraph);
        }
    };
});
System.register("scenegraph/CGraphConstraint", ["core/CEFRoot", "util/CUtil"], function (exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var CEFRoot_11, CUtil_14, CGraphConstraint;
    return {
        setters: [
            function (CEFRoot_11_1) {
                CEFRoot_11 = CEFRoot_11_1;
            },
            function (CUtil_14_1) {
                CUtil_14 = CUtil_14_1;
            }
        ],
        execute: function () {
            CGraphConstraint = class CGraphConstraint extends Object {
                constructor() {
                    super();
                }
                static factory(parent, factory) {
                    let node = new CGraphConstraint;
                    node._parent = parent;
                    node._cmd = factory.cmd;
                    node._code = factory.code;
                    return node;
                }
                execute() {
                    let result = false;
                    switch (this._cmd) {
                        case "test":
                            result = CEFRoot_11.CEFRoot.gTutor.testFeatureSet(this._code);
                            break;
                        case "exec":
                            try {
                                result = eval(this._code);
                            }
                            catch (err) {
                                CUtil_14.CUtil.trace("CSceneGraphNavigator.execute: " + err.toString());
                                result = false;
                            }
                            break;
                    }
                    return result;
                }
            };
            exports_28("CGraphConstraint", CGraphConstraint);
        }
    };
});
System.register("scenegraph/CGraphEdge", [], function (exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var CGraphEdge;
    return {
        setters: [],
        execute: function () {
            CGraphEdge = class CGraphEdge extends Object {
                constructor() {
                    super();
                }
                static factory(parent, factory) {
                    let edge = new CGraphEdge;
                    edge._parent = parent;
                    edge._edgeConst = factory.constraint;
                    edge._edgeNode = factory.edge;
                    if (factory.$P != undefined) {
                        edge._pid = factory.pid;
                        edge._prob = factory.$P.split('|');
                        edge._cycle = Number(factory.cycle);
                    }
                    return edge;
                }
                testPConstraint() {
                    let result = true;
                    let iter;
                    let rand;
                    if (this._pid != null) {
                        iter = this._parent.queryPConstraint(this._pid, this._prob.length, this._cycle);
                        rand = Math.random();
                        result = (rand < this._prob[iter]);
                    }
                    return result;
                }
                testConstraint() {
                    let result = true;
                    let constraint = this._parent.findConstraintByName(this._edgeConst);
                    if (constraint != null)
                        result = constraint.execute();
                    return result;
                }
                followEdge() {
                    return this._parent.findNodeByName(this._edgeNode);
                }
            };
            exports_29("CGraphEdge", CGraphEdge);
        }
    };
});
System.register("scenegraph/CGraphScene", ["core/CEFRoot"], function (exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var CEFRoot_12, CGraphScene;
    return {
        setters: [
            function (CEFRoot_12_1) {
                CEFRoot_12 = CEFRoot_12_1;
            }
        ],
        execute: function () {
            CGraphScene = class CGraphScene extends Object {
                constructor(factory, parent) {
                    super();
                    this._iteration = 0;
                    this._parent = parent;
                    this._name = factory.name;
                    this._title = factory.title;
                    this._page = factory.page;
                    this._class = factory.classname;
                    this._features = factory.features;
                    this._enqueue = (factory.enqueue === "true") ? true : false;
                    this._create = (factory.create === "true") ? true : false;
                    this._visible = (factory.visible === "true") ? true : false;
                    this._persist = (factory.persist === "true") ? true : false;
                    this._checkpnt = (factory.ischeckpnt === "true") ? true : false;
                    this._object = factory.object;
                    if (factory.$P != undefined) {
                        this._pid = factory.pid;
                        this._prob = factory.$P.split('|');
                        this._cycle = Number(factory.cycle);
                    }
                    if (this._create)
                        this.instantiateScene();
                    if (this._object != "null")
                        CEFRoot_12.CEFRoot.gTutor.automateScene(this._name, CEFRoot_12.CEFRoot.gTutor[this._object], false);
                }
                instantiateScene() {
                    this._scene = CEFRoot_12.CEFRoot.gTutor.instantiateScene(this._name, this._class, this._visible);
                    this.features = this._features;
                }
                destroyScene() {
                    this._scene = null;
                }
                set features(newFTR) {
                    this._scene.features = newFTR;
                }
                get features() {
                    if (this._scene != null)
                        return this._scene.features;
                    else
                        return this._features;
                }
                get hasPFeature() {
                    return (this._pid != null);
                }
                testPFeature() {
                    let iter = this._parent.queryPFeature(this._pid, this._prob.length, this._cycle);
                    let rand = Math.random();
                    return (rand < this._prob[iter]);
                }
                get scenename() {
                    return this._name;
                }
                get classname() {
                    return this._class;
                }
                get title() {
                    return this._title;
                }
                get isCheckPoint() {
                    return this._checkpnt;
                }
                get page() {
                    return this._page;
                }
                get persist() {
                    return this._persist;
                }
                get iteration() {
                    return this._iteration;
                }
                incIteration() {
                    this._iteration++;
                    return this._iteration;
                }
                enumDisplayList() {
                    CEFRoot_12.CEFRoot.gTutor.enumChildren(CEFRoot_12.CEFRoot.gTutor, 0);
                }
            };
            exports_30("CGraphScene", CGraphScene);
        }
    };
});
System.register("scenegraph/CGraphNode", ["scenegraph/CGraphEdge"], function (exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var CGraphEdge_1, EventDispatcher, CGraphNode;
    return {
        setters: [
            function (CGraphEdge_1_1) {
                CGraphEdge_1 = CGraphEdge_1_1;
            }
        ],
        execute: function () {
            EventDispatcher = createjs.EventDispatcher;
            CGraphNode = class CGraphNode extends EventDispatcher {
                constructor() {
                    super();
                    this._edges = new Array;
                }
                nodeFactory(parent, id, nodefactory) {
                    this._parent = parent;
                    this._id = id;
                    this._type = nodefactory.type;
                    this._name = nodefactory.name;
                    this._preEnter = nodefactory.preenter;
                    this._preExit = nodefactory.preexit;
                    if (this._preEnter == "")
                        this._preEnter = null;
                    if (this._preExit == "")
                        this._preExit = null;
                    for (let edge of nodefactory.edges) {
                        this._edges.push(CGraphEdge_1.CGraphEdge.factory(parent, edge));
                    }
                }
                get id() {
                    return this._id;
                }
                captureGraph(obj) {
                    return obj;
                }
                restoreGraph(obj) {
                }
                nextScene() {
                    return null;
                }
                nextNode() {
                    let edge;
                    let node = this;
                    if (this._preExit != null) {
                    }
                    for (let edge of this._edges) {
                        if (edge.testConstraint() && edge.testPConstraint()) {
                            node = edge.followEdge();
                            if (node != null && node._preEnter != null) {
                                eval(node._preEnter);
                            }
                            break;
                        }
                    }
                    if (this._edges.length == 0)
                        node = null;
                    return node;
                }
                applyNode() {
                    return false;
                }
                seekToScene(seekScene) {
                    return null;
                }
                seekToSceneByName(seekScene) {
                    return null;
                }
                resetNode() {
                }
            };
            exports_31("CGraphNode", CGraphNode);
        }
    };
});
System.register("bkt/CBKTSkill", [], function (exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var CBKTSkill;
    return {
        setters: [],
        execute: function () {
            CBKTSkill = class CBKTSkill {
                constructor() {
                }
                static factory(factory) {
                    var node = new CBKTSkill;
                    node.Bel = 0;
                    node.pL = factory.pL;
                    node.pT = factory.pT;
                    node.pG = factory.pG;
                    node.pS = factory.pS;
                    return node;
                }
                updateBelief(ans) {
                    if (ans == true)
                        this.Bel = this.calcTRUE();
                    else
                        this.Bel = this.calcFALSE();
                    this.pL = this.updatePrior(this.Bel);
                }
                calcTRUE() {
                    return (this.pL * (1 - this.pS)) / ((this.pL * (1 - this.pS)) + ((1 - this.pL) * this.pG));
                }
                calcFALSE() {
                    return (this.pL * this.pS) / ((this.pL * this.pS) + ((1 - this.pL) * (1 - this.pG)));
                }
                updatePrior(Bel) {
                    return Bel + ((1 - Bel) * this.pT);
                }
                queryBelief() {
                    return this.Bel;
                }
            };
            exports_32("CBKTSkill", CBKTSkill);
        }
    };
});
System.register("scenegraph/CGraphAction", ["scenegraph/CGraphNode"], function (exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var CGraphNode_1, CGraphAction;
    return {
        setters: [
            function (CGraphNode_1_1) {
                CGraphNode_1 = CGraphNode_1_1;
            }
        ],
        execute: function () {
            CGraphAction = class CGraphAction extends CGraphNode_1.CGraphNode {
                constructor() {
                    super();
                }
                static factory(parent, id, factory) {
                    let nodeFactoryData = factory.CNodes[id];
                    let node = new CGraphAction;
                    node.nodeFactory(parent, id, nodeFactoryData);
                    let actObject = factory.CActions[nodeFactoryData.name];
                    node._cmnd = actObject.cmd;
                    node._parms = actObject.parms;
                    return node;
                }
                captureGraph(obj) {
                    return obj;
                }
                restoreGraph(obj) {
                }
                nextScene() {
                    return null;
                }
                applyNode() {
                    return false;
                }
            };
            exports_33("CGraphAction", CGraphAction);
        }
    };
});
System.register("scenegraph/CGraphModule", ["scenegraph/CGraphNode", "scenegraph/CGraphScene", "core/CEFRoot", "util/CUtil"], function (exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    var CGraphNode_2, CGraphScene_1, CEFRoot_13, CUtil_15, CGraphModule;
    return {
        setters: [
            function (CGraphNode_2_1) {
                CGraphNode_2 = CGraphNode_2_1;
            },
            function (CGraphScene_1_1) {
                CGraphScene_1 = CGraphScene_1_1;
            },
            function (CEFRoot_13_1) {
                CEFRoot_13 = CEFRoot_13_1;
            },
            function (CUtil_15_1) {
                CUtil_15 = CUtil_15_1;
            }
        ],
        execute: function () {
            CGraphModule = class CGraphModule extends CGraphNode_2.CGraphNode {
                constructor() {
                    super();
                    this._scenes = new Array;
                    this._ndx = -1;
                }
                static factory(parent, id, moduleFactory, factory) {
                    var moduleFactoryData = factory.CModules[moduleFactory.name];
                    var node = new CGraphModule;
                    if (moduleFactory.edges)
                        node.nodeFactory(parent, id, moduleFactory);
                    node._reuse = moduleFactoryData.reuse;
                    var sceneList = moduleFactoryData.scenes;
                    for (var scene of sceneList) {
                        node._scenes.push(new CGraphScene_1.CGraphScene(scene, parent));
                    }
                    return node;
                }
                captureGraph(obj) {
                    obj['index'] = this._ndx.toString();
                    return obj;
                }
                restoreGraph(obj) {
                    this._ndx = Number(obj['index']);
                    return this._scenes[this._ndx];
                }
                nextScene() {
                    var nextScene = null;
                    var features;
                    while (this._ndx < this._scenes.length) {
                        this._ndx++;
                        if (this._ndx >= this._scenes.length)
                            nextScene = null;
                        else
                            nextScene = this._scenes[this._ndx];
                        if (nextScene != null) {
                            features = nextScene.features;
                            if (features != "") {
                                if (CEFRoot_13.CEFRoot.gTutor.testFeatureSet(features)) {
                                    if (nextScene.hasPFeature) {
                                        if (nextScene.testPFeature())
                                            break;
                                    }
                                    else
                                        break;
                                }
                                CUtil_15.CUtil.trace("Graph Feature: " + features + " :failed.");
                            }
                            else if (nextScene.hasPFeature) {
                                if (nextScene.testPFeature())
                                    break;
                            }
                            else
                                break;
                        }
                        else
                            break;
                    }
                    if (this._ndx >= this._scenes.length) {
                        if (this._reuse) {
                            this.resetNode();
                        }
                    }
                    return nextScene;
                }
                applyNode() {
                    dispatchEvent(new Event("todo"));
                    return false;
                }
                seekToScene(seekScene) {
                    var scene = null;
                    var ndx = 0;
                    for (scene of this._scenes) {
                        if (seekScene == scene) {
                            this._ndx = ndx;
                            break;
                        }
                        ndx++;
                    }
                    return scene;
                }
                resetNode() {
                    this._ndx = -1;
                }
            };
            exports_34("CGraphModule", CGraphModule);
        }
    };
});
System.register("scenegraph/CGraphModuleGroup", ["scenegraph/CGraphNode", "scenegraph/CGraphModule"], function (exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    var CGraphNode_3, CGraphModule_1, CGraphModuleGroup;
    return {
        setters: [
            function (CGraphNode_3_1) {
                CGraphNode_3 = CGraphNode_3_1;
            },
            function (CGraphModule_1_1) {
                CGraphModule_1 = CGraphModule_1_1;
            }
        ],
        execute: function () {
            CGraphModuleGroup = class CGraphModuleGroup extends CGraphNode_3.CGraphNode {
                constructor() {
                    super();
                    this._modules = new Array;
                    this._ndx = -1;
                    this._moduleShown = false;
                    this._shownCount = 0;
                }
                static factory(parent, id, groupFactory, factory) {
                    let groupFactoryData = factory.CModuleGroups[groupFactory.name];
                    let node = new CGraphModuleGroup;
                    if (groupFactory.edges)
                        node.nodeFactory(parent, id, groupFactory);
                    node.instanceNode = groupFactoryData.instanceNode;
                    node.type = groupFactoryData.type;
                    node.start = groupFactoryData.start;
                    node.show = groupFactoryData.show;
                    node.reuse = groupFactoryData.reuse;
                    node.onempty = groupFactoryData.onempty;
                    let moduleList = groupFactoryData.modules;
                    for (let moduleDescr of moduleList) {
                        if (moduleDescr.instanceNode != "") {
                            node._modules.push(parent.findNodeByName(moduleDescr.instanceNode));
                        }
                        else {
                            node._modules.push(CGraphModule_1.CGraphModule.factory(parent, "", moduleDescr, factory));
                        }
                    }
                    return node;
                }
                captureGraph(obj) {
                    obj['index'] = this._ndx.toString();
                    obj['_moduleShown'] = this._moduleShown.toString();
                    obj['_shownCount'] = this._shownCount.toString();
                    obj['moduleNode'] = this._modules[this._ndx].captureGraph(new Object);
                    return obj;
                }
                restoreGraph(obj) {
                    this._ndx = Number(obj['index']);
                    this._moduleShown = (obj['_moduleShown'] == 'true') ? true : false;
                    this._shownCount = Number(obj['_shownCount']);
                    return this._modules[this._ndx].restoreGraph(obj['moduleNode']);
                }
                initialize() {
                    switch (this.type) {
                        case CGraphModuleGroup.SEQUENTIAL:
                            switch (this.start) {
                                case CGraphModuleGroup.STOCHASTIC:
                                    break;
                                default:
                                    this._ndx = Number(this.start);
                                    break;
                            }
                            break;
                    }
                }
                nextScene() {
                    let nextScene = null;
                    if (this._ndx == -1)
                        this.initialize();
                    do {
                        nextScene = this._modules[this._ndx].nextScene();
                        if (nextScene == null) {
                            this._ndx++;
                            this._ndx = this._ndx % this._modules.length;
                            if (this.show != "all") {
                                if (this._moduleShown)
                                    this._shownCount++;
                                if (this._shownCount == Number(this.show)) {
                                    this._moduleShown = false;
                                    this._shownCount = 0;
                                    break;
                                }
                            }
                        }
                        else
                            break;
                    } while (this._ndx < this._modules.length);
                    if (nextScene != null)
                        this._moduleShown = true;
                    return nextScene;
                }
                applyNode() {
                    dispatchEvent(new Event("todo"));
                    return false;
                }
                seekToScene(seekScene) {
                    let module;
                    let scene = null;
                    let ndx = 0;
                    for (let module of this._modules) {
                        if (seekScene == module.seekToScene(seekScene)) {
                            this._ndx = ndx;
                            break;
                        }
                        ndx++;
                    }
                    return scene;
                }
                resetNode() {
                    this._ndx = -1;
                    this._shownCount = 0;
                    this._moduleShown = false;
                }
            };
            CGraphModuleGroup.SEQUENTIAL = "seqtype";
            CGraphModuleGroup.STOCHASTIC = "randtype";
            exports_35("CGraphModuleGroup", CGraphModuleGroup);
        }
    };
});
System.register("scenegraph/CSceneGraph", ["scenegraph/CGraphNode", "core/CEFNavigator", "scenegraph/CGraphConstraint", "core/CEFRoot", "bkt/CBKTSkill", "scenegraph/CGraphAction", "scenegraph/CGraphModule", "scenegraph/CGraphModuleGroup", "util/CUtil"], function (exports_36, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var CGraphNode_4, CEFNavigator_1, CGraphConstraint_1, CEFRoot_14, CBKTSkill_1, CGraphAction_1, CGraphModule_2, CGraphModuleGroup_1, CUtil_16, CSceneGraph;
    return {
        setters: [
            function (CGraphNode_4_1) {
                CGraphNode_4 = CGraphNode_4_1;
            },
            function (CEFNavigator_1_1) {
                CEFNavigator_1 = CEFNavigator_1_1;
            },
            function (CGraphConstraint_1_1) {
                CGraphConstraint_1 = CGraphConstraint_1_1;
            },
            function (CEFRoot_14_1) {
                CEFRoot_14 = CEFRoot_14_1;
            },
            function (CBKTSkill_1_1) {
                CBKTSkill_1 = CBKTSkill_1_1;
            },
            function (CGraphAction_1_1) {
                CGraphAction_1 = CGraphAction_1_1;
            },
            function (CGraphModule_2_1) {
                CGraphModule_2 = CGraphModule_2_1;
            },
            function (CGraphModuleGroup_1_1) {
                CGraphModuleGroup_1 = CGraphModuleGroup_1_1;
            },
            function (CUtil_16_1) {
                CUtil_16 = CUtil_16_1;
            }
        ],
        execute: function () {
            CSceneGraph = class CSceneGraph extends CGraphNode_4.CGraphNode {
                constructor() {
                    super();
                    this._nodes = new Object;
                    this._modules = new Object;
                    this._actions = new Object;
                    this._graphs = new Object;
                    this._constraints = new Object;
                    this._skillSet = new Object;
                }
                static factory(parent, id, factory) {
                    let scenegraph = new CSceneGraph;
                    scenegraph.parseNodes(factory);
                    scenegraph.parseConstraints(factory['CConstraints']);
                    scenegraph.parseSkills(factory['CSkills']);
                    return scenegraph;
                }
                captureGraph(obj) {
                    obj['currNodeID'] = this._currNode.id;
                    obj['currNode'] = this._currNode.captureGraph(new Object);
                    return obj;
                }
                restoreGraph(obj) {
                    this._currNode = this.findNodeByName(obj['currNodeID']);
                    this._currScene = this._currNode.restoreGraph(obj['currNode']);
                    this._prevScene = this._currScene;
                    return this._currScene;
                }
                sceneInstance() {
                    let objInstance = null;
                    try {
                        if (this._prevScene != null) {
                            objInstance = CEFNavigator_1.CEFNavigator.TutAutomator[this._prevScene.scenename].instance;
                        }
                    }
                    catch (err) {
                        CUtil_16.CUtil.trace("CSceneGraphNavigator.sceneInstance: " + err.toString());
                        objInstance = null;
                    }
                    return objInstance;
                }
                queryPFeature(pid, size, cycle) {
                    let iter = 0;
                    if (CSceneGraph._pFeatures[pid] != undefined) {
                        iter = CSceneGraph._pFeatures[pid] + 1;
                        if (iter >= size) {
                            iter = size - cycle;
                        }
                        CSceneGraph._pFeatures[pid] = iter;
                    }
                    else
                        CSceneGraph._pFeatures[pid] = 0;
                    return iter;
                }
                queryPConstraint(pid, size, cycle) {
                    let iter = 0;
                    if (CSceneGraph._pConstraints[pid] != undefined) {
                        iter = CSceneGraph._pConstraints[pid] + 1;
                        if (iter >= size) {
                            iter = size - cycle;
                        }
                        CSceneGraph._pConstraints[pid] = iter;
                    }
                    else
                        CSceneGraph._pConstraints[pid] = 0;
                    return iter;
                }
                seekTo(nxtScene) {
                    return null;
                }
                seekEnd() {
                    return null;
                }
                applyNode() {
                    return this._currNode.applyNode();
                }
                seekBack() {
                    return null;
                }
                seekRoot() {
                    this._currNode = this._nodes["root"];
                }
                nextScene() {
                    let nextNode;
                    if (this._currNode)
                        do {
                            this._currScene = this._currNode.nextScene();
                            if (this._currScene == null) {
                                nextNode = this._currNode.nextNode();
                                if (this._currNode == nextNode) {
                                    this._currScene = this._prevScene;
                                    this._currNode.seekToScene(this._currScene);
                                }
                                else {
                                    this._currNode = nextNode;
                                    if (this._currNode != null)
                                        this._currNode.applyNode();
                                }
                            }
                            else
                                this._currScene.incIteration();
                        } while ((this._currScene == null) && (this._currNode != null));
                    this._prevScene = this._currScene;
                    return this._currScene;
                }
                parseNodes(_factory) {
                    let nodeList = _factory.CNodes;
                    for (let name in nodeList) {
                        if (name != "COMMENT")
                            switch (nodeList[name].type) {
                                case "action":
                                    this._nodes[name] = CGraphAction_1.CGraphAction.factory(this, name, _factory);
                                    break;
                                case "module":
                                    this._nodes[name] = CGraphModule_2.CGraphModule.factory(this, name, nodeList[name], _factory);
                                    break;
                                case "modulegroup":
                                    this._nodes[name] = CGraphModuleGroup_1.CGraphModuleGroup.factory(this, name, nodeList[name], _factory);
                                    break;
                                case "subgraph":
                                    break;
                                case "external":
                                    break;
                            }
                    }
                    return true;
                }
                parseConstraints(constFactory) {
                    for (let name in constFactory) {
                        if (name != "COMMENT")
                            this._constraints[name] = CGraphConstraint_1.CGraphConstraint.factory(this, constFactory[name]);
                    }
                    return true;
                }
                parseSkills(skillsFactory) {
                    for (let name in skillsFactory) {
                        if (name != "COMMENT")
                            this._skillSet[name] = CBKTSkill_1.CBKTSkill.factory(skillsFactory[name]);
                    }
                    CEFRoot_14.CEFRoot.gTutor.ktSkills = this._skillSet;
                    return true;
                }
                findNodeByName(name) {
                    return this._nodes[name];
                }
                findConstraintByName(name) {
                    return this._constraints[name];
                }
                get node() {
                    return this._currNode;
                }
                set node(newNode) {
                    if (this._currNode != newNode)
                        this._currNode.resetNode();
                    this._currNode = newNode;
                }
                set scene(seekScene) {
                    this._currNode.seekToScene(seekScene);
                }
            };
            CSceneGraph._pFeatures = new Object;
            CSceneGraph._pConstraints = new Object;
            exports_36("CSceneGraph", CSceneGraph);
        }
    };
});
System.register("scenegraph/CGraphHistoryNode", [], function (exports_37, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
    var CGraphHistoryNode;
    return {
        setters: [],
        execute: function () {
            CGraphHistoryNode = class CGraphHistoryNode extends Object {
                constructor(_node, _scene) {
                    super();
                    this.node = _node;
                    this.scene = _scene;
                }
            };
            exports_37("CGraphHistoryNode", CGraphHistoryNode);
        }
    };
});
System.register("scenegraph/CGraphHistory", ["scenegraph/CGraphHistoryNode"], function (exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var CGraphHistoryNode_1, CGraphHistory;
    return {
        setters: [
            function (CGraphHistoryNode_1_1) {
                CGraphHistoryNode_1 = CGraphHistoryNode_1_1;
            }
        ],
        execute: function () {
            CGraphHistory = class CGraphHistory extends Object {
                constructor() {
                    super();
                    this._history = new Array();
                    this._volatile = false;
                    this._ndx = 0;
                }
                push(node, scene) {
                    if (scene != null) {
                        this._history.push(new CGraphHistoryNode_1.CGraphHistoryNode(node, scene));
                        this._ndx = this._history.length;
                    }
                }
                next() {
                    let next = null;
                    if (this._ndx < this._history.length) {
                        this._ndx = this._ndx + 1;
                        next = this._history[this._ndx - 1];
                    }
                    return next;
                }
                back() {
                    let prev = null;
                    if (this._ndx > 1) {
                        this._ndx = this._ndx - 1;
                        if (this._volatile)
                            this._history.pop();
                        prev = this._history[this._ndx - 1];
                    }
                    return prev;
                }
                set volatile(newState) {
                    this._volatile = newState;
                }
                get isVolatile() {
                    return this._volatile;
                }
            };
            exports_38("CGraphHistory", CGraphHistory);
        }
    };
});
System.register("scenegraph/CSceneGraphNavigator", ["scenegraph/CSceneGraph", "scenegraph/CGraphHistory", "core/CEFNavigator", "core/CEFRoot", "events/CEFEvent", "util/CUtil", "mongo/MObject", "mongo/CMongo", "core/CEFDoc"], function (exports_39, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    var CSceneGraph_1, CGraphHistory_1, CEFNavigator_2, CEFRoot_15, CEFEvent_5, CUtil_17, MObject_3, CMongo_2, CEFDoc_2, CSceneGraphNavigator;
    return {
        setters: [
            function (CSceneGraph_1_1) {
                CSceneGraph_1 = CSceneGraph_1_1;
            },
            function (CGraphHistory_1_1) {
                CGraphHistory_1 = CGraphHistory_1_1;
            },
            function (CEFNavigator_2_1) {
                CEFNavigator_2 = CEFNavigator_2_1;
            },
            function (CEFRoot_15_1) {
                CEFRoot_15 = CEFRoot_15_1;
            },
            function (CEFEvent_5_1) {
                CEFEvent_5 = CEFEvent_5_1;
            },
            function (CUtil_17_1) {
                CUtil_17 = CUtil_17_1;
            },
            function (MObject_3_1) {
                MObject_3 = MObject_3_1;
            },
            function (CMongo_2_1) {
                CMongo_2 = CMongo_2_1;
            },
            function (CEFDoc_2_1) {
                CEFDoc_2 = CEFDoc_2_1;
            }
        ],
        execute: function () {
            CSceneGraphNavigator = class CSceneGraphNavigator extends CEFNavigator_2.CEFNavigator {
                constructor() {
                    super();
                    this._iterations = new Object;
                }
                get sceneObj() {
                    return CSceneGraphNavigator._rootGraph.sceneInstance();
                }
                get iteration() {
                    let iCount;
                    try {
                        iCount = this._iterations[this._currScene.scenename].toString();
                    }
                    catch (err) {
                        iCount = "uninitialized";
                    }
                    return iCount;
                }
                updateSceneIteration() {
                    if (this._iterations[this._currScene.scenename] == undefined) {
                        this._iterations[this._currScene.scenename] = 1;
                    }
                    else {
                        if (!CEFRoot_15.CEFRoot.gTutor.testFeatureSet("NO_ITER"))
                            this._iterations[this._currScene.scenename]++;
                    }
                }
                static rootGraphFactory(factory) {
                    let scene;
                    this._history = new CGraphHistory_1.CGraphHistory();
                    if (factory['history'] != null) {
                        this._history.volatile = (factory['history'] == "volatile") ? true : false;
                    }
                    CSceneGraphNavigator._rootGraph = CSceneGraph_1.CSceneGraph.factory(null, "root", factory);
                    CSceneGraphNavigator._rootGraph.seekRoot();
                }
                enQueueTerminateEvent() {
                    addEventListener(CEFEvent_5.CEFEvent.ENTER_FRAME, this._deferredTerminate);
                }
                _deferredTerminate(e) {
                    removeEventListener(CEFEvent_5.CEFEvent.ENTER_FRAME, this._deferredTerminate);
                    this.gLogR.logTerminateEvent();
                }
                static set buttonBehavior(action) {
                    if (action == CSceneGraphNavigator.GOTONEXTSCENE)
                        this._fSceneGraph = true;
                    else
                        this._fSceneGraph = false;
                }
                onButtonNext(evt) {
                    dispatchEvent(new Event("NEXT_CLICK"));
                    this.traceGraphEdge();
                }
                recoverState() {
                    this._xType = "WOZNEXT";
                    CSceneGraphNavigator._rootGraph.parseSkills(CEFRoot_15.CEFRoot.sessionAccount.session.profile.stateData.ktSkills);
                    this.globals = CEFRoot_15.CEFRoot.sessionAccount.session.profile.stateData.globals;
                    CEFRoot_15.CEFRoot.gTutor.features = CEFRoot_15.CEFRoot.sessionAccount.session.profile.stateData.features;
                    this._phaseData = CEFRoot_15.CEFRoot.sessionAccount.session.profile.stateData.data;
                    this.seekToScene(CSceneGraphNavigator._rootGraph.restoreGraph(CEFRoot_15.CEFRoot.sessionAccount.session.profile.stateData.sceneGraph));
                }
                gotoNextScene() {
                    addEventListener(CEFEvent_5.CEFEvent.ENTER_FRAME, this._deferredNextScene);
                }
                _deferredNextScene(e) {
                    removeEventListener(CEFEvent_5.CEFEvent.ENTER_FRAME, this._deferredNextScene);
                    this.traceGraphEdge();
                }
                traceGraphEdge() {
                    let historyNode;
                    let nextScene;
                    let scene = CSceneGraphNavigator._rootGraph.sceneInstance();
                    try {
                        if (this._inNavigation)
                            return;
                        this._inNavigation = true;
                        if (CSceneGraphNavigator._fSceneGraph || scene == null || scene.nextGraphAnimation(true) == null) {
                            historyNode = CSceneGraphNavigator._history.next();
                            if (historyNode == null) {
                                nextScene = CSceneGraphNavigator._rootGraph.nextScene();
                                if (this._currScene != nextScene && nextScene != null) {
                                    CSceneGraphNavigator._history.push(CSceneGraphNavigator._rootGraph.node, nextScene);
                                }
                                else if (nextScene == null)
                                    this.enQueueTerminateEvent();
                            }
                            else {
                                nextScene = historyNode.scene;
                            }
                            this._xType = "WOZNEXT";
                            if (this._currScene != nextScene && nextScene != null) {
                                this.seekToScene(nextScene);
                            }
                            else {
                                this._inNavigation = false;
                            }
                        }
                        else {
                            this._inNavigation = false;
                        }
                    }
                    catch (err) {
                        CUtil_17.CUtil.trace("CSceneGraphNavigator.traceGraphEdge: " + err.toString());
                        let logData = { 'location': 'traceGraphEdge', 'message': err.toString() };
                        this.gLogR.logErrorEvent(logData);
                    }
                }
                onButtonPrev(evt) {
                    let historyNode;
                    try {
                        if (this._inNavigation)
                            return;
                        this._inNavigation = true;
                        do {
                            historyNode = CSceneGraphNavigator._history.back();
                            if (historyNode != null) {
                                this.features = historyNode.scene.features;
                                if (this.features != "") {
                                    if (!CEFRoot_15.CEFRoot.gTutor.testFeatureSet(this.features)) {
                                        continue;
                                    }
                                }
                                if (CSceneGraphNavigator._history.isVolatile) {
                                    CSceneGraphNavigator._rootGraph.node = historyNode.node;
                                    CSceneGraphNavigator._rootGraph.scene = historyNode.scene;
                                }
                                this._xType = "WOZBACK";
                                this.seekToScene(historyNode.scene);
                                break;
                            }
                            else {
                                this._inNavigation = false;
                            }
                        } while (historyNode != null);
                    }
                    catch (err) {
                        CUtil_17.CUtil.trace("CSceneGraphNavigator.onButtonPrev: " + err.toString());
                        let logData = { 'location': 'onButtonPrev', 'message': err.toString() };
                        this.gLogR.logErrorEvent(logData);
                    }
                }
                seekToScene(nextScene) {
                    let _progressData;
                    try {
                        this._nextScene = nextScene;
                        let logData;
                        if (CEFRoot_15.CEFRoot.fDemo)
                            CEFRoot_15.CEFRoot.fDeferDemoClick = true;
                        this._prevScene = this._currScene;
                        if (this._currScene)
                            CSceneGraphNavigator.TutAutomator[this._currScene.scenename].instance.preExitScene(this._xType, 0);
                        if (CSceneGraphNavigator.TutAutomator[this._nextScene.scenename] == undefined) {
                            this._nextScene.instantiateScene();
                        }
                        CSceneGraphNavigator.TutAutomator[this._nextScene.scenename].instance.preEnterScene(CSceneGraphNavigator.prntTutor, this._nextScene.scenename, this._nextScene.title, this._nextScene.page, this._xType);
                        if (this._currScene)
                            logData = { 'curscene': this._currScene.scenename, 'newscene': this._nextScene.scenename };
                        else
                            logData = { 'curscene': 'null', 'newscene': this._nextScene.scenename };
                        this.gLogR.logNavEvent(logData);
                        if (this._currScene) {
                            CSceneGraphNavigator.TutAutomator[this._currScene.scenename].instance.onExitScene();
                            CSceneGraphNavigator.TutAutomator[this._currScene.scenename].instance.doExitAction();
                        }
                        if (this._nextScene.isCheckPoint) {
                            if (_progressData == null) {
                                _progressData = new Object;
                                this._profileData = new Object;
                                _progressData['reify'] = new Object;
                                _progressData['reify']['phases'] = new Object;
                                _progressData['reify']['phases'][CEFRoot_15.CEFRoot.sessionAccount.session.profile_Index] = this._profileData;
                                this._profileData['stateData'] = new MObject_3.MObject;
                            }
                            this._profileData.progress = CMongo_2.CMongo._INPROGRESS;
                            this._profileData['stateData']['sceneGraph'] = CSceneGraphNavigator._rootGraph.captureGraph(new Object);
                            this._profileData['stateData']['ktSkills'] = CEFRoot_15.CEFRoot.gTutor.ktSkills;
                            this._profileData['stateData']['globals'] = this.globals;
                            this._profileData['stateData']['features'] = CEFRoot_15.CEFRoot.gTutor.features;
                            this._profileData['stateData']['data'] = this._phaseData;
                            this.gLogR.logProgressEvent(_progressData);
                        }
                        if (!this.gLogR.connectionActive) {
                            CEFDoc_2.CEFDoc.gApp.dispatchEvent(new Event("CONNECTION_LOST"));
                        }
                        this._currScene = this._nextScene;
                        this.updateSceneIteration();
                        CSceneGraphNavigator.prntTutor.xitions.addEventListener(CEFEvent_5.CEFEvent.COMPLETE, this.doEnterScene);
                        CSceneGraphNavigator.prntTutor.xitions.gotoScene(this._nextScene.scenename);
                    }
                    catch (err) {
                        CUtil_17.CUtil.trace("CSceneGraphNavigator.seekToScene: " + err.toString());
                        let logData = { 'location': 'seekToScene', 'message': err.toString() };
                        this.gLogR.logErrorEvent(logData);
                    }
                }
                doEnterScene(evt) {
                    try {
                        if (this.traceMode)
                            CUtil_17.CUtil.trace("doEnterScene: ", this.sceneCurr);
                        CSceneGraphNavigator.prntTutor.xitions.removeEventListener(CEFEvent_5.CEFEvent.COMPLETE, this.doEnterScene);
                        this.incFrameNdx();
                        if (this._prevScene && !this._prevScene.persist) {
                            CSceneGraphNavigator.prntTutor.destroyScene(this._prevScene.scenename);
                            this._prevScene.destroyScene();
                        }
                        CSceneGraphNavigator.TutAutomator[this._currScene.scenename].instance.onEnterScene(this._xType);
                        CSceneGraphNavigator.TutAutomator[this._currScene.scenename].instance.deferredEnterScene(this._xType);
                        if (CEFRoot_15.CEFRoot.fDemo)
                            CSceneGraphNavigator.prntTutor.dispatchEvent(new Event("deferedDemoCheck"));
                        this._inNavigation = false;
                    }
                    catch (err) {
                        CUtil_17.CUtil.trace("CSceneGraphNavigator.doEnterScene: " + err.toString());
                        let logData = { 'location': 'doEnterScene', 'message': err.toString() };
                        this.gLogR.logErrorEvent(logData);
                    }
                }
            };
            CSceneGraphNavigator._fSceneGraph = true;
            CSceneGraphNavigator.GOTONEXTSCENE = "incSceneGraph";
            CSceneGraphNavigator.GOTONEXTANIMATION = "incAnimationGraph";
            exports_39("CSceneGraphNavigator", CSceneGraphNavigator);
        }
    };
});
System.register("events/CEFSceneCueEvent", ["util/CUtil"], function (exports_40, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    var Event, CUtil_18, CEFSceneCueEvent;
    return {
        setters: [
            function (CUtil_18_1) {
                CUtil_18 = CUtil_18_1;
            }
        ],
        execute: function () {
            Event = createjs.Event;
            CEFSceneCueEvent = class CEFSceneCueEvent extends Event {
                constructor(type, CueID, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                    this.cueID = CueID;
                }
                clone() {
                    CUtil_18.CUtil.trace("cloning CEFSceneCueEvent:");
                    return new CEFSceneCueEvent(this.type, this.cueID, this.bubbles, this.cancelable);
                }
            };
            CEFSceneCueEvent.CUEPOINT = "cuePoint";
            exports_40("CEFSceneCueEvent", CEFSceneCueEvent);
        }
    };
});
System.register("events/CEFCommandEvent", [], function (exports_41, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    var Event, CEFCommandEvent;
    return {
        setters: [],
        execute: function () {
            Event = createjs.Event;
            CEFCommandEvent = class CEFCommandEvent extends Event {
                constructor(type, _objCmd, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                    this.objCmd = _objCmd;
                }
                clone() {
                    return new CEFCommandEvent(this.type, this.objCmd, this.bubbles, this.cancelable);
                }
            };
            CEFCommandEvent.OBJCMD = "objcmd";
            exports_41("CEFCommandEvent", CEFCommandEvent);
        }
    };
});
System.register("events/CEFScriptEvent", [], function (exports_42, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
    var Event, CEFScriptEvent;
    return {
        setters: [],
        execute: function () {
            Event = createjs.Event;
            CEFScriptEvent = class CEFScriptEvent extends Event {
                constructor(type, _script, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                    this.script = _script;
                }
                clone() {
                    return new CEFScriptEvent(this.type, this.script, this.bubbles, this.cancelable);
                }
            };
            CEFScriptEvent.SCRIPT = "script";
            exports_42("CEFScriptEvent", CEFScriptEvent);
        }
    };
});
System.register("events/CEFActionEvent", [], function (exports_43, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    var Event, CEFActionEvent;
    return {
        setters: [],
        execute: function () {
            Event = createjs.Event;
            CEFActionEvent = class CEFActionEvent extends Event {
                constructor(type, Prop1, Prop2 = null, Prop3 = null, Prop4 = null, Prop5 = null, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                    this.prop1 = Prop1;
                    this.prop2 = Prop2;
                    this.prop3 = Prop3;
                    this.prop4 = Prop4;
                    this.prop5 = Prop5;
                }
                clone() {
                    return new CEFActionEvent(this.type, this.prop1, this.prop2, this.prop3, this.prop4, this.prop5, this.bubbles, this.cancelable);
                }
            };
            CEFActionEvent.CHKCMD = "chkcmd";
            CEFActionEvent.STCCMD = "stccmd";
            CEFActionEvent.INDCMD = "indcmd";
            CEFActionEvent.RMPCMD = "rmpcmd";
            CEFActionEvent.PMTCMD = "pmtcmd";
            CEFActionEvent.NAVCMD = "navcmd";
            CEFActionEvent.EFFECT = "effect";
            exports_43("CEFActionEvent", CEFActionEvent);
        }
    };
});
System.register("core/CEFSceneSequence", ["core/CEFRoot", "core/CEFScene", "core/CEFTimer", "events/CEFNavEvent", "animationgraph/CAnimationGraph", "scenegraph/CSceneGraphNavigator", "events/CEFSceneCueEvent", "events/CEFCommandEvent", "events/CEFScriptEvent", "events/CEFActionEvent", "events/CEFEvent", "util/CUtil"], function (exports_44, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
    var CEFRoot_16, CEFScene_2, CEFTimer_1, CEFNavEvent_1, CAnimationGraph_1, CSceneGraphNavigator_1, CEFSceneCueEvent_1, CEFCommandEvent_1, CEFScriptEvent_1, CEFActionEvent_1, CEFEvent_6, CUtil_19, CEFSceneSequence;
    return {
        setters: [
            function (CEFRoot_16_1) {
                CEFRoot_16 = CEFRoot_16_1;
            },
            function (CEFScene_2_1) {
                CEFScene_2 = CEFScene_2_1;
            },
            function (CEFTimer_1_1) {
                CEFTimer_1 = CEFTimer_1_1;
            },
            function (CEFNavEvent_1_1) {
                CEFNavEvent_1 = CEFNavEvent_1_1;
            },
            function (CAnimationGraph_1_1) {
                CAnimationGraph_1 = CAnimationGraph_1_1;
            },
            function (CSceneGraphNavigator_1_1) {
                CSceneGraphNavigator_1 = CSceneGraphNavigator_1_1;
            },
            function (CEFSceneCueEvent_1_1) {
                CEFSceneCueEvent_1 = CEFSceneCueEvent_1_1;
            },
            function (CEFCommandEvent_1_1) {
                CEFCommandEvent_1 = CEFCommandEvent_1_1;
            },
            function (CEFScriptEvent_1_1) {
                CEFScriptEvent_1 = CEFScriptEvent_1_1;
            },
            function (CEFActionEvent_1_1) {
                CEFActionEvent_1 = CEFActionEvent_1_1;
            },
            function (CEFEvent_6_1) {
                CEFEvent_6 = CEFEvent_6_1;
            },
            function (CUtil_19_1) {
                CUtil_19 = CUtil_19_1;
            }
        ],
        execute: function () {
            CEFSceneSequence = class CEFSceneSequence extends CEFScene_2.CEFScene {
                constructor() {
                    super();
                    this._interval = CEFSceneSequence.DEFAULT_MONITOR_INTERVAL;
                    this.ktUpdated = false;
                    this.animationGraph = null;
                    this.traceMode = false;
                    this.initControlNames();
                    this.audioStartTimer = new CEFTimer_1.CEFTimer(10, 1);
                    this.audioStartTimer.reset();
                    this.audioStartTimer.stop();
                }
                Destructor() {
                    CEFRoot_16.CEFRoot.gTutor.removeEventListener(CEFSceneSequence.WOZREPLAY, this.sceneReplay);
                    this.disConnectAudio(this.Saudio1);
                    super.Destructor();
                }
                setButtonBehavior(behavior) {
                    if (behavior == "incrScene")
                        CSceneGraphNavigator_1.CSceneGraphNavigator.buttonBehavior = CSceneGraphNavigator_1.CSceneGraphNavigator.GOTONEXTSCENE;
                    else
                        CSceneGraphNavigator_1.CSceneGraphNavigator.buttonBehavior = CSceneGraphNavigator_1.CSceneGraphNavigator.GOTONEXTANIMATION;
                }
                rewindScene() {
                    if ((CEFRoot_16.CEFRoot.gSceneConfig != null) && (CEFRoot_16.CEFRoot.gSceneConfig.scenedata[name].rewind != undefined))
                        this.parseOBJ(this, CEFRoot_16.CEFRoot.gSceneConfig.scenedata[name].rewind.children(), "rewind");
                    if ((CEFRoot_16.CEFRoot.gSceneConfig != null) && (CEFRoot_16.CEFRoot.gSceneConfig.scenedata[name].demoinit != undefined))
                        this.parseOBJ(this, CEFRoot_16.CEFRoot.gSceneConfig.scenedata[name].demoinit.children(), "demoinit");
                }
                sceneReplay(evt) {
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("sceneReplay: " + evt);
                    this.rewindScene();
                    this.parseOBJ(null, CEFRoot_16.CEFRoot.gSceneConfig.scenedata[name].preenter.children(), "preenter");
                    this.audioStartTimer.reset();
                    this.audioStartTimer.start();
                }
                scenePlay() {
                    this.audioStartTimer.reset();
                    this.audioStartTimer.start();
                }
                playHandler(evt) {
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("CEFSceneSequence timerHandler: " + evt);
                    this.audioStartTimer.stop();
                    this.audioStartTimer.reset();
                    if (this.Saudio1 != null) {
                        this.Saudio1.gotoAndStop(1);
                        this.Saudio1.bindPlay(CEFRoot_16.CEFRoot.gTutor);
                    }
                }
                connectNavigator(Navigator) {
                    this.navigator = Navigator;
                }
                connectAudio(audioClip) {
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("Connect Audio Behavior");
                    audioClip.stop();
                    audioClip.addEventListener(CEFSceneCueEvent_1.CEFSceneCueEvent.CUEPOINT, this.doSceneCue);
                    audioClip.addEventListener(CEFCommandEvent_1.CEFCommandEvent.OBJCMD, this.doActionXML);
                    audioClip.addEventListener(CEFNavEvent_1.CEFNavEvent.WOZNAVINC, this.navNext);
                    audioClip.addEventListener(CEFActionEvent_1.CEFActionEvent.EFFECT, this.effectHandler);
                    audioClip.addEventListener(CEFScriptEvent_1.CEFScriptEvent.SCRIPT, this.scriptHandler);
                }
                disConnectAudio(audioClip) {
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("disConnectAudio Audio Behavior");
                    if (audioClip) {
                        audioClip.stop();
                        audioClip.removeEventListener(CEFSceneCueEvent_1.CEFSceneCueEvent.CUEPOINT, this.doSceneCue);
                        audioClip.removeEventListener(CEFCommandEvent_1.CEFCommandEvent.OBJCMD, this.doActionXML);
                        audioClip.removeEventListener(CEFNavEvent_1.CEFNavEvent.WOZNAVINC, this.navNext);
                        audioClip.removeEventListener(CEFActionEvent_1.CEFActionEvent.EFFECT, this.effectHandler);
                        audioClip.removeEventListener(CEFScriptEvent_1.CEFScriptEvent.SCRIPT, this.scriptHandler);
                    }
                }
                bindAudio(audioClass) {
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("bindAudio Behavior");
                    let audio = new audioClass;
                    if (audio)
                        this.connectAudio(audio);
                    return audio;
                }
                createAudio() {
                }
                initAudio() {
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("Base:initAudio Behavior");
                    this.createAudio();
                    if (this.Saudio1)
                        this.connectAudio(this.Saudio1);
                }
                initControlNames() {
                }
                initPrompts() {
                }
                navNext(event) {
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("navNext: " + event);
                    this.navigator.gotoNextScene();
                }
                doSceneCue(evt) {
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("SceneCue: " + evt);
                    this.disConnectAudio(this.Saudio1);
                }
                doActionXML(evt) {
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("doActionXML: " + evt.objCmd);
                    this.parseOBJ(this, evt.objCmd.children(), "xmlCmd");
                }
                parseOBJ(tarObj, tarOBJ, xType) {
                    let element;
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("doActionXML: " + tarOBJ);
                    for (element of tarOBJ) {
                        switch (element) {
                            case "animationgraph":
                                if (element['features'] != undefined) {
                                    if (!CEFRoot_16.CEFRoot.gTutor.testFeatureSet(String(element['features'])))
                                        break;
                                }
                                try {
                                    this.animationGraph = CAnimationGraph_1.CAnimationGraph.factory(this, "root", element.name);
                                    if (this.animationGraph != null) {
                                        this.Saudio1 = this.bindAudio(CEFRoot_16.CEFRoot.getDefinitionByName(this.animationGraph.nextAnimation()));
                                        this.Saudio1.stop();
                                    }
                                }
                                catch (err) {
                                    CUtil_19.CUtil.trace("animationgraph JSON Spec Failed" + err);
                                }
                                break;
                            case "actionsequence":
                                if (element['features'] != undefined) {
                                    if (!CEFRoot_16.CEFRoot.gTutor.testFeatureSet(String(element['features'])))
                                        break;
                                }
                                this.nextActionTrack(element.selection);
                                break;
                            case "actiontrack":
                                if (element['features'] != undefined) {
                                    if (!CEFRoot_16.CEFRoot.gTutor.testFeatureSet(String(element['features'])))
                                        break;
                                }
                                try {
                                    this.Saudio1 = this.bindAudio(CEFRoot_16.CEFRoot.getDefinitionByName(element.type));
                                    this.Saudio1.stop();
                                }
                                catch (err) {
                                    CUtil_19.CUtil.trace("CEFSceneSequence:parseOBJ: " + err);
                                }
                                break;
                        }
                    }
                    if (tarObj)
                        super.parseOBJ(tarObj, tarOBJ, xType);
                }
                nextGraphAnimation(bNavigating = false) {
                    let nextSeq;
                    if (this.animationGraph != null) {
                        if (this.Saudio1) {
                            this.disConnectAudio(this.Saudio1);
                            this.Saudio1 = null;
                        }
                        nextSeq = this.animationGraph.nextAnimation();
                        if (nextSeq != null) {
                            this.Saudio1 = this.bindAudio(CEFRoot_16.CEFRoot.getDefinitionByName(nextSeq));
                            this.scenePlay();
                        }
                        else if (!bNavigating) {
                            this.navigator.gotoNextScene();
                        }
                    }
                    return nextSeq;
                }
                nextActionTrack(tarXML = null) {
                    if (tarXML != null) {
                        this.seqTrack = tarXML;
                        this.seqIndex = 0;
                    }
                    if (this.Saudio1) {
                        this.disConnectAudio(this.Saudio1);
                        this.Saudio1 = null;
                    }
                    while (this.seqTrack[this.seqIndex] != null) {
                        this.parseOBJ(null, this.seqTrack[this.seqIndex].actiontrack, "");
                        this.seqID = this.seqTrack[this.seqIndex].id;
                        if (tarXML == null)
                            this.scenePlay();
                        this.seqIndex++;
                        if (this.Saudio1)
                            break;
                    }
                }
                gotoActionTrackId(id = null) {
                    if (id == null || id == "")
                        id = this.seqID;
                    if (this.Saudio1) {
                        this.disConnectAudio(this.Saudio1);
                        this.Saudio1 = null;
                    }
                    this.seqIndex = 0;
                    for (let track of this.seqTrack) {
                        this.seqIndex++;
                        if (track.id == id) {
                            this.parseOBJ(null, track.actiontrack, "");
                            this.seqID = id;
                            this.scenePlay();
                        }
                    }
                }
                preEnterScene(lTutor, sceneLabel, sceneTitle, scenePage, Direction) {
                    let result;
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("Default Pre-Enter Scene Behavior: " + sceneTitle);
                    result = super.preEnterScene(lTutor, sceneLabel, sceneTitle, scenePage, Direction);
                    this.initPrompts();
                    this.initAudio();
                    return result;
                }
                deferredEnterScene(Direction) {
                    if ((Direction == "WOZNEXT") ||
                        (Direction == "WOZGOTO")) {
                        if (this.animationGraph != null) {
                            this.animationGraph.onEnterRoot();
                        }
                        CEFRoot_16.CEFRoot.gTutor.timeStamp.createLogAttr("dur_" + name, true);
                    }
                }
                onEnterScene(Direction) {
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("CEFSceneSequence Enter Scene Behavior:" + Direction);
                    if ((Direction == "WOZNEXT") ||
                        (Direction == "WOZGOTO")) {
                        if (this.Saudio1)
                            this.audioStartTimer.start();
                    }
                    CEFRoot_16.CEFRoot.gTutor.addEventListener(CEFSceneSequence.WOZREPLAY, this.sceneReplay);
                    super.onEnterScene(Direction);
                }
                onExitScene() {
                    if (this.traceMode)
                        CUtil_19.CUtil.trace("CEFSceneSequence Exit Scene Behavior:");
                    this.disConnectAudio(this.Saudio1);
                    this.Saudio1 = null;
                    CEFRoot_16.CEFRoot.gTutor.removeEventListener(CEFSceneSequence.WOZREPLAY, this.sceneReplay);
                    this._sceneData = new Object;
                    if ((CEFRoot_16.CEFRoot.gSceneConfig != null) && (CEFRoot_16.CEFRoot.gSceneConfig.scenedata[name].logging != undefined)) {
                        this.parseOBJ(this, CEFRoot_16.CEFRoot.gSceneConfig.scenedata[name].logging.children(), "logging");
                    }
                    this._sceneData['scene'] = name;
                    this._sceneData['iteration'] = CEFRoot_16.CEFRoot.gTutor.gNavigator.iteration.toString();
                    this._sceneData['duration'] = CEFRoot_16.CEFRoot.gTutor.timeStamp.createLogAttr("dur_" + name);
                    this.gLogR.logStateEvent(this._sceneData);
                    if ((CEFRoot_16.CEFRoot.gSceneConfig != null) && (CEFRoot_16.CEFRoot.gSceneConfig.scenedata[name].logterm != undefined)) {
                        if (CEFRoot_16.CEFRoot.gSceneConfig.scenedata[name].logterm.features != undefined) {
                            if (CEFRoot_16.CEFRoot.gTutor.testFeatureSet(String(CEFRoot_16.CEFRoot.gSceneConfig.scenedata[name].logterm.features)))
                                this.enQueueTerminateEvent();
                        }
                        else
                            this.enQueueTerminateEvent();
                    }
                    this.updateKT();
                    super.onExitScene();
                }
                enQueueTerminateEvent() {
                    addEventListener(CEFEvent_6.CEFEvent.ENTER_FRAME, this._deferredTerminate);
                }
                _deferredTerminate(e) {
                    removeEventListener(CEFEvent_6.CEFEvent.ENTER_FRAME, this._deferredTerminate);
                    this.gLogR.logTerminateEvent();
                }
                updateKT() {
                    if (!this.ktUpdated) {
                        this.ktUpdated = true;
                    }
                }
            };
            CEFSceneSequence.DEFAULT_MONITOR_INTERVAL = 3000;
            exports_44("CEFSceneSequence", CEFSceneSequence);
        }
    };
});
System.register("core/CEFNavigator", ["core/CEFScene", "util/CUtil", "events/CEFMouseEvent", "events/CEFEvent", "core/CEFRoot"], function (exports_45, context_45) {
    "use strict";
    var __moduleName = context_45 && context_45.id;
    var CEFScene_3, CUtil_20, CEFMouseEvent_3, CEFEvent_7, CEFRoot_17, CEFNavigator;
    return {
        setters: [
            function (CEFScene_3_1) {
                CEFScene_3 = CEFScene_3_1;
            },
            function (CUtil_20_1) {
                CUtil_20 = CUtil_20_1;
            },
            function (CEFMouseEvent_3_1) {
                CEFMouseEvent_3 = CEFMouseEvent_3_1;
            },
            function (CEFEvent_7_1) {
                CEFEvent_7 = CEFEvent_7_1;
            },
            function (CEFRoot_17_1) {
                CEFRoot_17 = CEFRoot_17_1;
            }
        ],
        execute: function () {
            CEFNavigator = class CEFNavigator extends CEFScene_3.CEFScene {
                constructor() {
                    super(...arguments);
                    this.sceneCnt = 0;
                    this._inNavigation = false;
                }
                CEFNavigator() {
                    this.traceMode = false;
                    this.SnextButton.addEventListener(CEFMouseEvent_3.CEFMouseEvent.WOZCLICK, this.onButtonNext);
                    this.SbackButton.addEventListener(CEFMouseEvent_3.CEFMouseEvent.WOZCLICK, this.onButtonPrev);
                    this.gNavigator = this;
                }
                get iteration() {
                    return "null";
                }
                get sceneObj() {
                    return null;
                }
                addScene(SceneTitle, ScenePage, SceneName, SceneClass, ScenePersist, SceneFeatures = "null") {
                }
                connectToTutor(parentTutor, autoTutor) {
                    CEFNavigator.prntTutor = parentTutor;
                    CEFNavigator.TutAutomator = autoTutor;
                }
                get scenePrev() {
                    return 0;
                }
                set scenePrev(scenePrevINT) {
                }
                get sceneCurr() {
                    return 0;
                }
                set sceneCurr(sceneCurrINT) {
                }
                get sceneCurrINC() {
                    return 0;
                }
                get sceneCurrDEC() {
                    return 0;
                }
                get sceneTitle() {
                    return new Array();
                }
                set sceneTitle(sceneTitleARRAY) {
                }
                get sceneSeq() {
                    return new Array();
                }
                set sceneSeq(sceneSeqARRAY) {
                }
                get scenePage() {
                    return new Array();
                }
                set scenePage(scenePageARRAY) {
                }
                get sceneName() {
                    return new Array();
                }
                set sceneName(sceneSeqARRAY) {
                }
                get sceneClass() {
                    return new Array();
                }
                set sceneClass(sceneSeqARRAY) {
                }
                get scenePersist() {
                    return new Array();
                }
                set scenePersist(sceneSeqARRAY) {
                }
                findSceneOrd(tarScene) {
                    if (this.traceMode)
                        CUtil_20.CUtil.trace("findSceneOrd: " + tarScene);
                    let i1;
                    let ordScene = 0;
                    let newScene;
                    for (i1 = 0; i1 < this.sceneCnt; i1++) {
                        if (this.sceneSeq[i1] == tarScene) {
                            ordScene = i1;
                            break;
                        }
                    }
                    return ordScene;
                }
                goToScene(tarScene) {
                    if (this.traceMode)
                        CUtil_20.CUtil.trace("Nav To: " + tarScene);
                    let ordScene = -1;
                    let newScene = "";
                    let redScene = "";
                    if (this._inNavigation)
                        return;
                    this._inNavigation = true;
                    if (CEFRoot_17.CEFRoot.fDemo)
                        CEFRoot_17.CEFRoot.fDeferDemoClick = true;
                    ordScene = this.findSceneOrd(tarScene);
                    if (ordScene >= 0) {
                        if (this.traceMode)
                            CUtil_20.CUtil.trace("Nav GoTo Found: " + tarScene);
                        this.scenePrev = this.sceneCurr;
                        if (tarScene == "SdemoScene") {
                            CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]].instance.preExitScene("WOZGOTO", this.sceneCurr);
                            this.sceneCurr = ordScene;
                        }
                        else
                            switch (redScene = CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]].instance.preExitScene("WOZGOTO", this.sceneCurr)) {
                                case CEFNavigator.CANCELNAV:
                                    if (CEFRoot_17.CEFRoot.fDemo)
                                        CEFRoot_17.CEFRoot.fDeferDemoClick = false;
                                    this._inNavigation = false;
                                    return;
                                case CEFNavigator.OKNAV:
                                    this.sceneCurr = ordScene;
                                    break;
                                default:
                                    this.sceneCurr = this.findSceneOrd(redScene);
                            }
                        for (redScene = this.sceneSeq[this.sceneCurr]; redScene != newScene;) {
                            if (CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]] == undefined) {
                                CEFNavigator.prntTutor.instantiateScene(this.sceneName[this.sceneCurr], this.sceneClass[this.sceneCurr]);
                            }
                            newScene = redScene;
                            redScene = CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]].instance.preEnterScene(CEFNavigator.prntTutor, newScene, this.sceneTitle[this.sceneCurr], this.scenePage[this.sceneCurr], "WOZGOTO");
                            if (redScene == "WOZNEXT") {
                                this.sceneCurrINC;
                                redScene = this.sceneSeq[this.sceneCurr];
                            }
                            if (redScene == "WOZBACK") {
                                this.sceneCurrDEC;
                                redScene = this.sceneSeq[this.sceneCurr];
                            }
                            else
                                this.sceneCurr = this.findSceneOrd(redScene);
                        }
                        let logData = { 'navevent': 'navgoto', 'curscene': this.scenePrev, 'newscene': redScene };
                        this.gLogR.logNavEvent(logData);
                        CEFNavigator.TutAutomator[this.sceneSeq[this.scenePrev]].instance.onExitScene();
                        CEFNavigator.prntTutor.xitions.addEventListener(CEFEvent_7.CEFEvent.COMPLETE, this.doEnterScene);
                        CEFNavigator.prntTutor.xitions.gotoScene(redScene);
                    }
                }
                onButtonNext(evt) {
                    this.gotoNextScene();
                }
                recoverState() {
                }
                gotoNextScene() {
                    if (this.traceMode)
                        CUtil_20.CUtil.trace("Nav Next: ");
                    let newScene;
                    let redScene = "";
                    if (this._inNavigation)
                        return;
                    this._inNavigation = true;
                    if (CEFRoot_17.CEFRoot.fDemo)
                        CEFRoot_17.CEFRoot.fDeferDemoClick = true;
                    if (this.sceneCurr < this.sceneCnt) {
                        if (this.traceMode)
                            CUtil_20.CUtil.trace("this.scenePrev: " + this.scenePrev + "  - this.sceneCurr: " + this.sceneCurr);
                        this.scenePrev = this.sceneCurr;
                        if (this.traceMode)
                            CUtil_20.CUtil.trace("this.sceneSeq[this.sceneCurr]: " + this.sceneSeq[this.sceneCurr]);
                        switch (redScene = CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]].instance.preExitScene("WOZNEXT", this.sceneCurr)) {
                            case CEFNavigator.CANCELNAV:
                                if (CEFRoot_17.CEFRoot.fDemo)
                                    CEFRoot_17.CEFRoot.fDeferDemoClick = false;
                                this._inNavigation = false;
                                return;
                            case CEFNavigator.OKNAV:
                                this.sceneCurrINC;
                                break;
                            default:
                                this.sceneCurr = this.findSceneOrd(redScene);
                        }
                        for (redScene = this.sceneSeq[this.sceneCurr]; redScene != newScene;) {
                            CUtil_20.CUtil.trace(this.sceneSeq[this.sceneCurr]);
                            CUtil_20.CUtil.trace(CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]]);
                            if (CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]] == undefined) {
                                CEFNavigator.prntTutor.instantiateScene(this.sceneName[this.sceneCurr], this.sceneClass[this.sceneCurr]);
                            }
                            newScene = redScene;
                            redScene = CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]].instance.preEnterScene(CEFNavigator.prntTutor, newScene, this.sceneTitle[this.sceneCurr], this.scenePage[this.sceneCurr], "WOZNEXT");
                            if (redScene == "WOZNEXT") {
                                this.sceneCurrINC;
                                redScene = this.sceneSeq[this.sceneCurr];
                            }
                            if (redScene == "WOZBACK") {
                                this.sceneCurrDEC;
                                redScene = this.sceneSeq[this.sceneCurr];
                            }
                            else
                                this.sceneCurr = this.findSceneOrd(redScene);
                        }
                        let logData = { 'navevent': 'navnext', 'curscene': this.scenePrev, 'newscene': redScene };
                        this.gLogR.logNavEvent(logData);
                        CEFNavigator.TutAutomator[this.sceneSeq[this.scenePrev]].instance.onExitScene();
                        CEFNavigator.prntTutor.xitions.addEventListener(CEFEvent_7.CEFEvent.COMPLETE, this.doEnterNext);
                        CEFNavigator.prntTutor.xitions.gotoScene(redScene);
                    }
                }
                onButtonPrev(evt) {
                    this.gotoPrevScene();
                }
                gotoPrevScene() {
                    if (this.traceMode)
                        CUtil_20.CUtil.trace("Nav Back: ");
                    let newScene = "";
                    let redScene = "";
                    if (this._inNavigation)
                        return;
                    this._inNavigation = true;
                    if (CEFRoot_17.CEFRoot.fDemo)
                        CEFRoot_17.CEFRoot.fDeferDemoClick = true;
                    if (this.sceneCurr >= 1) {
                        this.scenePrev = this.sceneCurr;
                        switch (redScene = CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]].instance.preExitScene("WOZBACK", this.sceneCurr)) {
                            case CEFNavigator.CANCELNAV:
                                if (CEFRoot_17.CEFRoot.fDemo)
                                    CEFRoot_17.CEFRoot.fDeferDemoClick = false;
                                this._inNavigation = false;
                                return;
                            case CEFNavigator.OKNAV:
                                this.sceneCurrDEC;
                                break;
                            default:
                                this.sceneCurr = this.findSceneOrd(redScene);
                        }
                        for (redScene = this.sceneSeq[this.sceneCurr]; redScene != newScene;) {
                            newScene = redScene;
                            redScene = CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]].instance.preEnterScene(CEFNavigator.prntTutor, newScene, this.sceneTitle[this.sceneCurr], this.scenePage[this.sceneCurr], "WOZBACK");
                            if (redScene == "WOZNEXT") {
                                this.sceneCurrINC;
                                redScene = this.sceneSeq[this.sceneCurr];
                            }
                            if (redScene == "WOZBACK") {
                                this.sceneCurrDEC;
                                redScene = this.sceneSeq[this.sceneCurr];
                            }
                            else
                                this.sceneCurr = this.findSceneOrd(redScene);
                        }
                        let logData = { 'navevent': 'navback', 'curscene': this.scenePrev, 'newscene': redScene };
                        this.gLogR.logNavEvent(logData);
                        CEFNavigator.TutAutomator[this.sceneSeq[this.scenePrev]].instance.onExitScene();
                        CEFNavigator.prntTutor.xitions.addEventListener(CEFEvent_7.CEFEvent.COMPLETE, this.doEnterBack);
                        CEFNavigator.prntTutor.xitions.gotoScene(redScene);
                    }
                }
                doEnterNext(evt) {
                    if (this.traceMode)
                        CUtil_20.CUtil.trace("this.doEnterNext: ", this.sceneCurr);
                    CEFNavigator.prntTutor.xitions.removeEventListener(CEFEvent_7.CEFEvent.COMPLETE, this.doEnterNext);
                    if (!this.scenePersist[this.scenePrev]) {
                        CEFNavigator.prntTutor.destroyScene(this.sceneName[this.scenePrev]);
                    }
                    CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]].instance.onEnterScene("WOZNEXT");
                    if (CEFRoot_17.CEFRoot.fDemo)
                        CEFNavigator.prntTutor.dispatchEvent(new Event("deferedDemoCheck"));
                    this._inNavigation = false;
                }
                doEnterBack(evt) {
                    if (this.traceMode)
                        CUtil_20.CUtil.trace("doEnterBack: ", this.sceneCurr);
                    CEFNavigator.prntTutor.xitions.removeEventListener(CEFEvent_7.CEFEvent.COMPLETE, this.doEnterBack);
                    if (!this.scenePersist[this.scenePrev]) {
                        CEFNavigator.prntTutor.destroyScene(this.sceneName[this.scenePrev]);
                    }
                    CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]].instance.onEnterScene("WOZBACK");
                    if (CEFRoot_17.CEFRoot.fDemo)
                        CEFNavigator.prntTutor.dispatchEvent(new Event("deferedDemoCheck"));
                    this._inNavigation = false;
                }
                doEnterScene(evt) {
                    if (this.traceMode)
                        CUtil_20.CUtil.trace("this.doEnterScene: ", this.sceneCurr);
                    CEFNavigator.prntTutor.xitions.removeEventListener(CEFEvent_7.CEFEvent.COMPLETE, this.doEnterScene);
                    if (!this.scenePersist[this.scenePrev]) {
                        CEFNavigator.prntTutor.destroyScene(this.sceneName[this.scenePrev]);
                    }
                    CEFNavigator.TutAutomator[this.sceneSeq[this.sceneCurr]].instance.onEnterScene("WOZGOTO");
                    if (CEFRoot_17.CEFRoot.fDemo)
                        CEFNavigator.prntTutor.dispatchEvent(new Event("deferedDemoCheck"));
                    this._inNavigation = false;
                }
            };
            exports_45("CEFNavigator", CEFNavigator);
        }
    };
});
System.register("core/CEFTimeStamp", ["core/CEFObject", "util/CUtil"], function (exports_46, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
    var CEFObject_5, CUtil_21, CEFTimeStamp;
    return {
        setters: [
            function (CEFObject_5_1) {
                CEFObject_5 = CEFObject_5_1;
            },
            function (CUtil_21_1) {
                CUtil_21 = CUtil_21_1;
            }
        ],
        execute: function () {
            CEFTimeStamp = class CEFTimeStamp extends CEFObject_5.CEFObject {
                constructor() {
                    if (CEFTimeStamp._baseTime == 0)
                        CEFTimeStamp._baseTime = Number(CUtil_21.CUtil.getTimer());
                    super();
                }
                getStartTime(objprop) {
                    var sResult;
                    var dT;
                    if (!this.hasOwnProperty(objprop)) {
                        sResult = 'invalid';
                    }
                    else {
                        dT = (this[objprop] - CEFTimeStamp._baseTime) / 1000;
                        sResult = dT.toFixed(3);
                    }
                    return sResult;
                }
                createLogAttr(objprop, restart = false) {
                    var sResult;
                    var dT;
                    if (!this.hasOwnProperty(objprop)) {
                        this[objprop] = Number(CUtil_21.CUtil.getTimer());
                        dT = (this[objprop] - CEFTimeStamp._baseTime) / 1000;
                    }
                    else {
                        if (restart)
                            this[objprop] = Number(CUtil_21.CUtil.getTimer());
                        dT = (Number(CUtil_21.CUtil.getTimer()) - this[objprop]) / 1000;
                    }
                    return sResult = dT.toFixed(3);
                }
            };
            CEFTimeStamp._baseTime = 0;
            exports_46("CEFTimeStamp", CEFTimeStamp);
        }
    };
});
System.register("controls/CEFSkillBar", ["core/CEFObject"], function (exports_47, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    var CEFObject_6, CEFSkillBar;
    return {
        setters: [
            function (CEFObject_6_1) {
                CEFObject_6 = CEFObject_6_1;
            }
        ],
        execute: function () {
            CEFSkillBar = class CEFSkillBar extends CEFObject_6.CEFObject {
                constructor() {
                    super();
                    this.level = 0;
                }
                set skillName(newName) {
                    this._name = newName;
                }
                get skillName() {
                    return this._name;
                }
                set level(newLevel) {
                    this._invlevel = 1 - newLevel;
                    this._level = newLevel;
                    this.Smask.x = -(this.SprogBar['width'] * this._invlevel);
                    this._level *= 100;
                    this.Stext.text = this._level.toFixed(0) + '%';
                }
                get level() {
                    return this._level;
                }
            };
            exports_47("CEFSkillBar", CEFSkillBar);
        }
    };
});
System.register("controls/CEFSkilloMeter", ["core/CEFObject", "events/CEFMouseEvent"], function (exports_48, context_48) {
    "use strict";
    var __moduleName = context_48 && context_48.id;
    var CEFObject_7, CEFMouseEvent_4, CEFSkilloMeter;
    return {
        setters: [
            function (CEFObject_7_1) {
                CEFObject_7 = CEFObject_7_1;
            },
            function (CEFMouseEvent_4_1) {
                CEFMouseEvent_4 = CEFMouseEvent_4_1;
            }
        ],
        execute: function () {
            CEFSkilloMeter = class CEFSkilloMeter extends CEFObject_7.CEFObject {
                constructor() {
                    super();
                    this.tfValue = new Array(6);
                    let i1;
                    super();
                    for (i1 = 0; i1 < 6; i1++)
                        this.updateSkill(i1 + 1, 0, "");
                    this.addEventListener(CEFMouseEvent_4.CEFMouseEvent.CLICK, this.skillClick);
                }
                Destructor() {
                    super.Destructor();
                }
                updateSkill(index, newValue, tfVal) {
                    this["Sskill" + index].level = newValue;
                    this.tfValue[index - 1] = tfVal;
                }
                updateName(index, newName) {
                    this["Sskill" + index].skillName = newName;
                }
                set title(newTitle) {
                    this.Stitle.text = newTitle;
                }
                skillClick(evt) {
                    let i1;
                    let SkillData = "";
                    for (i1 = 1; i1 <= 6; i1++) {
                        SkillData += this["Sskill" + i1].skillName;
                        SkillData += ": ";
                        SkillData += this["Sskill" + i1].level;
                        SkillData += ": ";
                        SkillData += this.tfValue[i1 - 1];
                        SkillData += "\n";
                    }
                }
            };
            exports_48("CEFSkilloMeter", CEFSkilloMeter);
        }
    };
});
System.register("core/CEFTitleBar", ["core/CEFRoot", "core/CEFScene", "core/CEFObject", "events/CEFMouseEvent", "events/CEFNavEvent", "util/CUtil"], function (exports_49, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
    var CEFRoot_18, CEFScene_4, CEFObject_8, CEFMouseEvent_5, CEFNavEvent_2, CUtil_22, CEFTitleBar;
    return {
        setters: [
            function (CEFRoot_18_1) {
                CEFRoot_18 = CEFRoot_18_1;
            },
            function (CEFScene_4_1) {
                CEFScene_4 = CEFScene_4_1;
            },
            function (CEFObject_8_1) {
                CEFObject_8 = CEFObject_8_1;
            },
            function (CEFMouseEvent_5_1) {
                CEFMouseEvent_5 = CEFMouseEvent_5_1;
            },
            function (CEFNavEvent_2_1) {
                CEFNavEvent_2 = CEFNavEvent_2_1;
            },
            function (CUtil_22_1) {
                CUtil_22 = CUtil_22_1;
            }
        ],
        execute: function () {
            CEFTitleBar = class CEFTitleBar extends CEFScene_4.CEFScene {
                constructor() {
                    super(...arguments);
                    this._demoInhibit = false;
                    this._demoClicked = false;
                }
                CEFTitleBar() {
                    if (this.traceMode)
                        CUtil_22.CUtil.trace("CEFTitleBar:Constructor");
                    try {
                        this.Splay.addEventListener(CEFMouseEvent_5.CEFMouseEvent.WOZCLICK, this.onTutorPlay);
                        this.Spause.addEventListener(CEFMouseEvent_5.CEFMouseEvent.WOZCLICK, this.onTutorPause);
                        this.Sreplay.addEventListener(CEFMouseEvent_5.CEFMouseEvent.WOZCLICK, this.onTutorReplay);
                        this.Splay.visible = false;
                        this.Sskill.visible = CEFRoot_18.CEFRoot.fSkillometer;
                        this.Sskill.title = "skills";
                        this.Sskill.updateName(1, "rule0");
                        this.Sskill.updateName(2, "rule1");
                        this.Sskill.updateName(3, "rule2");
                        this.Sskill.updateName(4, "rule_vvfar");
                        this.Sskill.updateName(5, "rule_tov");
                        this.Sskill.updateName(6, "rule_cvslog");
                    }
                    catch (err) {
                    }
                }
                configDemoButton(_Tutor) {
                    if (CEFRoot_18.CEFRoot.fDemo) {
                        if (this.traceMode)
                            CUtil_22.CUtil.trace("Title in Demo Mode");
                        this.SdemoButton.addEventListener(CEFMouseEvent_5.CEFMouseEvent.WOZCLICKED, this.doDemoClick);
                        _Tutor.addEventListener("deferedDemoCheck", this.doDeferedDemoClick);
                    }
                    else {
                        this.SdemoButton.visible = false;
                        this.addEventListener(CEFMouseEvent_5.CEFMouseEvent.WOZCLICKED, this.doTitleClick);
                    }
                }
                doTitleClick(evt) {
                    if (this.traceMode)
                        CUtil_22.CUtil.trace("TitleClick");
                }
                doDemoClick(evt) {
                    if (CEFRoot_18.CEFRoot.fDeferDemoClick)
                        this._demoClicked = true;
                    else
                        CEFRoot_18.CEFRoot.gTutor.goToScene(new CEFNavEvent_2.CEFNavEvent(CEFNavEvent_2.CEFNavEvent.WOZNAVTO, "SdemoScene"));
                }
                doDeferedDemoClick(evt) {
                    CEFRoot_18.CEFRoot.fDeferDemoClick = false;
                    if (this._demoClicked) {
                        this._demoClicked = false;
                        CEFRoot_18.CEFRoot.gTutor.goToScene(new CEFNavEvent_2.CEFNavEvent(CEFNavEvent_2.CEFNavEvent.WOZNAVTO, "SdemoScene"));
                    }
                }
                onTutorPlay(evt) {
                    if (this.traceMode)
                        CUtil_22.CUtil.trace("onTutorPlay: ");
                    CEFRoot_18.CEFRoot.gTutor.wozPlay();
                    this.Splay.visible = false;
                    this.Spause.visible = true;
                }
                onTutorPause(evt) {
                    if (this.traceMode)
                        CUtil_22.CUtil.trace("onTutorPause: ");
                    CEFRoot_18.CEFRoot.gTutor.wozPause();
                    this.Spause.visible = false;
                    this.Splay.visible = true;
                }
                onTutorReplay(evt) {
                    if (this.traceMode)
                        CUtil_22.CUtil.trace("onTutorReplay: ");
                    CEFRoot_18.CEFRoot.gTutor.wozReplay();
                }
                setObjMode(TutScene, sMode) {
                    if (this.traceMode)
                        CUtil_22.CUtil.trace("\t*** Start - Walking Top Level Nav Objects***");
                    for (let sceneObj in TutScene) {
                        if (sceneObj != "instance" && TutScene[sceneObj].instance instanceof CEFObject_8.CEFObject) {
                            TutScene[sceneObj].instance.setAutomationMode(TutScene[sceneObj], sMode);
                        }
                    }
                    if (this.traceMode)
                        CUtil_22.CUtil.trace("\t*** End - Walking Top Level Nav Objects***");
                }
                dumpSceneObjs(TutScene) {
                    for (let sceneObj in TutScene) {
                        if (this.traceMode)
                            CUtil_22.CUtil.trace("\tNavPanelObj : " + sceneObj);
                        if (sceneObj != "instance" && TutScene[sceneObj].instance instanceof CEFObject_8.CEFObject) {
                            if (this.traceMode)
                                CUtil_22.CUtil.trace("\tCEF***");
                            TutScene[sceneObj].instance.dumpSubObjs(TutScene[sceneObj], "\t");
                        }
                    }
                }
            };
            exports_49("CEFTitleBar", CEFTitleBar);
        }
    };
});
System.register("scenes/CEFScene0", ["core/CEFSceneSequence", "util/CUtil"], function (exports_50, context_50) {
    "use strict";
    var __moduleName = context_50 && context_50.id;
    var CEFSceneSequence_1, CUtil_23, CEFScene0;
    return {
        setters: [
            function (CEFSceneSequence_1_1) {
                CEFSceneSequence_1 = CEFSceneSequence_1_1;
            },
            function (CUtil_23_1) {
                CUtil_23 = CUtil_23_1;
            }
        ],
        execute: function () {
            CEFScene0 = class CEFScene0 extends CEFSceneSequence_1.CEFSceneSequence {
                constructor() {
                    super();
                    CUtil_23.CUtil.trace("CEFScene0:Constructor");
                }
                captureDefState(TutScene) {
                    super.captureDefState(TutScene);
                }
                restoreDefState(TutScene) {
                    super.restoreDefState(TutScene);
                }
            };
            exports_50("CEFScene0", CEFScene0);
        }
    };
});
System.register("kt/CEFBNode", [], function (exports_51, context_51) {
    "use strict";
    var __moduleName = context_51 && context_51.id;
    var CEFBNode;
    return {
        setters: [],
        execute: function () {
            CEFBNode = class CEFBNode {
                constructor() {
                    this._aritytags = new Array;
                    this._vector = new Array;
                }
                getValue(row, col) {
                    return this._vector[row][col];
                }
                setValue(row, col, newVal) {
                    this._vector[row][col] = newVal;
                }
                normalize() {
                    let sum;
                    let i1;
                    let i2;
                    let width = this._vector[0].length;
                    for (i2 = 0; i2 < width; i2++) {
                        sum = 0;
                        for (i1 = 0; i1 < this._arity; i1++)
                            sum += this._vector[i1][i2];
                        for (i1 = 0; i1 < this._arity; i1++)
                            this._vector[i1][i2] /= sum;
                    }
                }
                tagToNdx(tag) {
                    let i1;
                    for (i1 = 0; i1 < this._arity; i1++) {
                        if (this._aritytags[i1] == tag)
                            return i1;
                    }
                    return -1;
                }
                loadXML(xmlSrc) {
                    let i1;
                    this._name = xmlSrc.name;
                    this._arity = xmlSrc.arity;
                    this._aritytags = xmlSrc.aritytags[0].split(',');
                    for (i1 = 0; i1 < this._arity; i1++) {
                        this._vector.push(xmlSrc.values[i1].split(','));
                    }
                }
                saveXML() {
                    let propVector;
                    return propVector;
                }
            };
            exports_51("CEFBNode", CEFBNode);
        }
    };
});
System.register("events/CEFPropertyChangeEventKind", [], function (exports_52, context_52) {
    "use strict";
    var __moduleName = context_52 && context_52.id;
    var CEFPropertyChangeEventKind;
    return {
        setters: [],
        execute: function () {
            CEFPropertyChangeEventKind = class CEFPropertyChangeEventKind {
            };
            CEFPropertyChangeEventKind.UPDATE = "update";
            CEFPropertyChangeEventKind.DELETE = "delete";
            exports_52("CEFPropertyChangeEventKind", CEFPropertyChangeEventKind);
        }
    };
});
System.register("events/CEFPropertyChangeEvent", ["events/CEFPropertyChangeEventKind"], function (exports_53, context_53) {
    "use strict";
    var __moduleName = context_53 && context_53.id;
    var Event, CEFPropertyChangeEventKind_1, CEFPropertyChangeEvent;
    return {
        setters: [
            function (CEFPropertyChangeEventKind_1_1) {
                CEFPropertyChangeEventKind_1 = CEFPropertyChangeEventKind_1_1;
            }
        ],
        execute: function () {
            Event = createjs.Event;
            CEFPropertyChangeEvent = class CEFPropertyChangeEvent extends Event {
                constructor(type, bubbles = false, cancelable = false, kind = null, property = null, oldValue = null, newValue = null, source = null) {
                    super(type, bubbles, cancelable);
                    this.kind = kind;
                    this.property = property;
                    this.oldValue = oldValue;
                    this.newValue = newValue;
                    this.source = source;
                }
                static createUpdateEvent(source, property, oldValue, newValue) {
                    let event = new CEFPropertyChangeEvent(CEFPropertyChangeEvent.PROPERTY_CHANGE);
                    event.kind = CEFPropertyChangeEventKind_1.CEFPropertyChangeEventKind.UPDATE;
                    event.oldValue = oldValue;
                    event.newValue = newValue;
                    event.source = source;
                    event.property = property;
                    return event;
                }
                clone() {
                    return new CEFPropertyChangeEvent(this.type, this.bubbles, this.cancelable, this.kind, this.property, this.oldValue, this.newValue, this.source);
                }
            };
            CEFPropertyChangeEvent.PROPERTY_CHANGE = "propertyChange";
            exports_53("CEFPropertyChangeEvent", CEFPropertyChangeEvent);
        }
    };
});
System.register("kt/CEFKTNode", ["kt/CEFBNode", "events/CEFPropertyChangeEvent"], function (exports_54, context_54) {
    "use strict";
    var __moduleName = context_54 && context_54.id;
    var CEFBNode_1, CEFPropertyChangeEvent_1, EventDispatcher, CEFKTNode;
    return {
        setters: [
            function (CEFBNode_1_1) {
                CEFBNode_1 = CEFBNode_1_1;
            },
            function (CEFPropertyChangeEvent_1_1) {
                CEFPropertyChangeEvent_1 = CEFPropertyChangeEvent_1_1;
            }
        ],
        execute: function () {
            EventDispatcher = createjs.EventDispatcher;
            CEFKTNode = class CEFKTNode extends EventDispatcher {
                CEFKTNode() {
                    this._hypoNode = new CEFBNode_1.CEFBNode;
                    this._evidNode = new CEFBNode_1.CEFBNode;
                }
                set newEvid(evid) {
                    let oldValue = this._hypoNode.getValue(0, 0);
                    let evidNdx = this._evidNode.tagToNdx(evid);
                    let i1;
                    for (i1 = 0; i1 < this._arity; i1++) {
                        this._hypoNode.setValue(i1, 0, this._evidNode.getValue(evidNdx, i1) * this._hypoNode.getValue(i1, 0));
                    }
                    this._hypoNode.normalize();
                    this.dispatchBeliefChangedEvent(oldValue);
                }
                get predValue() {
                    let prediction = 0;
                    prediction += this._evidNode.getValue(0, 0) * this._hypoNode.getValue(0, 0);
                    prediction += this._evidNode.getValue(0, 1) * this._hypoNode.getValue(1, 0);
                    return prediction;
                }
                dispatchBeliefChangedEvent(oldValue) {
                    if (this.hasEventListener("propertyChange"))
                        this.dispatchEvent(CEFPropertyChangeEvent_1.CEFPropertyChangeEvent.createUpdateEvent(this._hypoNode, "value", oldValue, this._hypoNode.getValue(0, 0)));
                }
                get BeliefName() {
                    return this._hypoNode._name;
                }
                get BeliefValue() {
                    return this._hypoNode.getValue(0, 0);
                }
                loadXML(xmlSrc) {
                    this._name = xmlSrc.name;
                    this._pT = xmlSrc.pt;
                    this._hypoNode.loadXML(xmlSrc.hyponode[0]);
                    this._evidNode.loadXML(xmlSrc.evidnode[0]);
                    this._arity = this._hypoNode._arity;
                }
                saveXML() {
                    let propVector;
                    return propVector;
                }
            };
            exports_54("CEFKTNode", CEFKTNode);
        }
    };
});
System.register("network/CLogManagerType", [], function (exports_55, context_55) {
    "use strict";
    var __moduleName = context_55 && context_55.id;
    var CLogManagerType;
    return {
        setters: [],
        execute: function () {
            CLogManagerType = class CLogManagerType {
                readonlyructor() {
                }
            };
            CLogManagerType.RECLOGNONE = 0;
            CLogManagerType.RECORDEVENTS = 1;
            CLogManagerType.LOGEVENTS = 2;
            CLogManagerType.RECLOGEVENTS = 3;
            CLogManagerType.MODE_JSON = "MODE_JSON";
            CLogManagerType.JSON_ACKLOG = "JSON_ACKLOG";
            CLogManagerType.JSON_ACKTERM = "JSON_ACKTERM";
            exports_55("CLogManagerType", CLogManagerType);
        }
    };
});
System.register("events/CEFKeyboardEvent", [], function (exports_56, context_56) {
    "use strict";
    var __moduleName = context_56 && context_56.id;
    var Event, CEFKeyboardEvent;
    return {
        setters: [],
        execute: function () {
            Event = createjs.Event;
            CEFKeyboardEvent = class CEFKeyboardEvent extends Event {
                constructor(type, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                }
            };
            CEFKeyboardEvent.KEY_PRESS = "keypress";
            CEFKeyboardEvent.KEY_DOWN = "keydown";
            CEFKeyboardEvent.KEY_UP = "keyup";
            exports_56("CEFKeyboardEvent", CEFKeyboardEvent);
        }
    };
});
System.register("core/CEFTutorRoot", ["core/CEFRoot", "core/CEFDoc", "core/CEFObject", "core/CEFCursorProxy", "core/CEFTransitions", "core/CEFTimeStamp", "core/CEFScene", "core/CEFSceneSequence", "events/CEFEvent", "events/CEFNavEvent", "events/CEFMouseEvent", "kt/CEFKTNode", "network/CLogManagerType", "events/CEFKeyboardEvent", "util/CUtil"], function (exports_57, context_57) {
    "use strict";
    var __moduleName = context_57 && context_57.id;
    var CEFRoot_19, CEFDoc_3, CEFObject_9, CEFCursorProxy_1, CEFTransitions_1, CEFTimeStamp_1, CEFScene_5, CEFSceneSequence_2, CEFEvent_8, CEFNavEvent_3, CEFMouseEvent_6, CEFKTNode_1, CLogManagerType_1, CEFKeyboardEvent_1, CUtil_24, MovieClip, DisplayObjectContainer, CEFTutorRoot;
    return {
        setters: [
            function (CEFRoot_19_1) {
                CEFRoot_19 = CEFRoot_19_1;
            },
            function (CEFDoc_3_1) {
                CEFDoc_3 = CEFDoc_3_1;
            },
            function (CEFObject_9_1) {
                CEFObject_9 = CEFObject_9_1;
            },
            function (CEFCursorProxy_1_1) {
                CEFCursorProxy_1 = CEFCursorProxy_1_1;
            },
            function (CEFTransitions_1_1) {
                CEFTransitions_1 = CEFTransitions_1_1;
            },
            function (CEFTimeStamp_1_1) {
                CEFTimeStamp_1 = CEFTimeStamp_1_1;
            },
            function (CEFScene_5_1) {
                CEFScene_5 = CEFScene_5_1;
            },
            function (CEFSceneSequence_2_1) {
                CEFSceneSequence_2 = CEFSceneSequence_2_1;
            },
            function (CEFEvent_8_1) {
                CEFEvent_8 = CEFEvent_8_1;
            },
            function (CEFNavEvent_3_1) {
                CEFNavEvent_3 = CEFNavEvent_3_1;
            },
            function (CEFMouseEvent_6_1) {
                CEFMouseEvent_6 = CEFMouseEvent_6_1;
            },
            function (CEFKTNode_1_1) {
                CEFKTNode_1 = CEFKTNode_1_1;
            },
            function (CLogManagerType_1_1) {
                CLogManagerType_1 = CLogManagerType_1_1;
            },
            function (CEFKeyboardEvent_1_1) {
                CEFKeyboardEvent_1 = CEFKeyboardEvent_1_1;
            },
            function (CUtil_24_1) {
                CUtil_24 = CUtil_24_1;
            }
        ],
        execute: function () {
            MovieClip = createjs.MovieClip;
            DisplayObjectContainer = createjs.Container;
            CEFTutorRoot = class CEFTutorRoot extends CEFRoot_19.CEFRoot {
                constructor() {
                    super();
                    this.fFeatures = new Array();
                    this.fDefaults = new Array();
                    this.fIntroVideo = false;
                    this.fCVSIntro = true;
                    this.fRampsIntro = true;
                    this.fRampPreTest = false;
                    this.fFreeResponse = 0;
                    this.fStepByStep0 = false;
                    this.fStepByStep1 = false;
                    this.fEIA = true;
                    this.fEIB = true;
                    this.fEIC = true;
                    this.fSummaryVideo = false;
                    this.fRampPostTest = true;
                    this.timeStamp = new CEFTimeStamp_1.CEFTimeStamp;
                    this.playing = new Array();
                    this.isPaused = false;
                    this.scenePtr = new Array;
                    this.stateStack = new Array();
                    this.sceneCnt = 0;
                    this.xitions = new CEFTransitions_1.CEFTransitions;
                    this.replayIndex = new Array;
                    this.replayTime = 0;
                    this.Running = new Array();
                    this.runCount = 0;
                    this.ktNets = new Object;
                    this.sceneGraph = "<sceneGraph/>";
                    this.traceMode = false;
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("CEFTutorRoot:Constructor");
                    CEFRoot_19.CEFRoot.gTutor = this;
                    this.tutorAutoObj = new Object;
                }
                resetZorder() {
                    this.StitleBar.setTopMost();
                    this.Sscene0.setTopMost();
                }
                captureSceneGraph() {
                }
                setTutorDefaults(featSet) {
                    let feature;
                    let featArray = featSet.split(":");
                    this.fDefaults = new Array();
                    for (let feature of featArray) {
                        this.fDefaults.push(feature);
                    }
                }
                setTutorFeatures(featSet) {
                    let feature;
                    let featArray = new Array;
                    if (featSet.length > 0)
                        featArray = featSet.split(":");
                    this.fFeatures = new Array();
                    for (let feature of this.fDefaults) {
                        this.fFeatures.push(feature);
                    }
                    for (let feature of featArray) {
                        this.fFeatures.push(feature);
                    }
                }
                get features() {
                    return this.fFeatures.join(":");
                }
                set features(ftrSet) {
                    this.fFeatures = ftrSet.split(":");
                }
                set addFeature(feature) {
                    if (this.fFeatures.indexOf(feature) == -1) {
                        this.fFeatures.push(feature);
                    }
                }
                set delFeature(feature) {
                    let fIndex;
                    if ((fIndex = this.fFeatures.indexOf(feature)) != -1) {
                        this.fFeatures.splice(fIndex, 1);
                    }
                }
                testFeature(element, index, arr) {
                    if (element.charAt(0) == "!") {
                        return (this.fFeatures.indexOf(element.substring(1)) != -1) ? false : true;
                    }
                    else
                        return (this.fFeatures.indexOf(element) != -1) ? true : false;
                }
                testFeatureSet(featSet) {
                    let feature;
                    let disjFeat = featSet.split(":");
                    let conjFeat;
                    if (featSet == "")
                        return true;
                    for (let feature of disjFeat) {
                        conjFeat = feature.split(",");
                        if (conjFeat.every(this.testFeature))
                            return true;
                    }
                    return false;
                }
                traceFeatures() {
                    CUtil_24.CUtil.trace(this.fFeatures);
                }
                addScene(sceneTitle, scenePage, sceneName, sceneClass, sceneFeatures, sceneEnqueue, sceneCreate, sceneVisible, scenePersist, sceneObj = null) {
                    if (sceneEnqueue)
                        this.SnavPanel.addScene(sceneTitle, scenePage, sceneName, sceneClass, scenePersist, sceneFeatures);
                    if (sceneCreate)
                        this.instantiateScene(sceneName, sceneClass, sceneVisible);
                    if (sceneObj != null)
                        this.automateScene(sceneName, sceneObj, false);
                }
                instantiateScene(sceneName, sceneClass, sceneVisible = false) {
                    let i1;
                    let tarScene;
                    let subScene;
                    let ClassRef = CEFRoot_19.CEFRoot.getDefinitionByName(sceneClass);
                    tarScene = new ClassRef();
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Creating Scene : " + sceneName);
                    this.addChild(tarScene);
                    tarScene.visible = false;
                    tarScene.stop();
                    if (sceneVisible) {
                        this[sceneName] = tarScene;
                        tarScene.visible = true;
                    }
                    this.automateScene(sceneName, tarScene);
                    tarScene.addEventListener("Start", this.questionStart);
                    tarScene.addEventListener("Done", this.questionComplete);
                    tarScene.addEventListener(CEFNavEvent_3.CEFNavEvent.WOZNAVBACK, this.goBackScene);
                    tarScene.addEventListener(CEFNavEvent_3.CEFNavEvent.WOZNAVNEXT, this.goNextScene);
                    tarScene.addEventListener(CEFNavEvent_3.CEFNavEvent.WOZNAVTO, this.goToScene);
                    for (i1 = 0; i1 < tarScene.numChildren; i1++) {
                        subScene = tarScene.getChildAt(i1);
                        if (subScene instanceof MovieClip)
                            subScene.gotoAndStop(1);
                    }
                    return tarScene;
                }
                destroyScene(sceneName) {
                    let sceneObj = this.getChildByName(sceneName);
                    let wozObj;
                    if (sceneObj != null) {
                        sceneObj.removeEventListener("Start", this.questionStart);
                        sceneObj.removeEventListener("Done", this.questionComplete);
                        sceneObj.removeEventListener(CEFNavEvent_3.CEFNavEvent.WOZNAVBACK, this.goBackScene);
                        sceneObj.removeEventListener(CEFNavEvent_3.CEFNavEvent.WOZNAVNEXT, this.goNextScene);
                        sceneObj.removeEventListener(CEFNavEvent_3.CEFNavEvent.WOZNAVTO, this.goToScene);
                        if (sceneObj instanceof CEFObject_9.CEFObject) {
                            wozObj = sceneObj;
                            wozObj.Destructor();
                        }
                        this.removeChild(sceneObj);
                    }
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Destroying Scene : " + sceneName);
                    if (this.hasOwnProperty(sceneName)) {
                        this[sceneName] = null;
                        if (this.tutorAutoObj.hasOwnProperty(sceneName)) {
                            this.tutorAutoObj[sceneName].instance = null;
                            delete this.tutorAutoObj[sceneName];
                        }
                    }
                }
                automateScene(sceneName, sceneObj, nameObj = true) {
                    this[sceneName] = sceneObj;
                    if (nameObj)
                        this[sceneName].name = sceneName;
                    if (sceneObj instanceof CEFSceneSequence_2.CEFSceneSequence)
                        sceneObj.connectNavigator(this.SnavPanel);
                    this.tutorAutoObj[sceneName] = new Object;
                    this.tutorAutoObj[sceneName].instance = sceneObj;
                    sceneObj.initAutomation(sceneObj, this.tutorAutoObj[sceneName], "", this.gLogR, this);
                    sceneObj.captureDefState(this.tutorAutoObj[sceneName]);
                    sceneObj.restoreDefState(this.tutorAutoObj[sceneName]);
                    this.resetZorder();
                }
                instantiateKT() {
                    if ((CEFRoot_19.CEFRoot.gSceneConfig != null) && (CEFRoot_19.CEFRoot.gSceneConfig.ktnets != undefined))
                        this.loadKTNets(CEFRoot_19.CEFRoot.gSceneConfig.ktnets);
                }
                loadKTNets(tarXML) {
                    for (let ktnet of tarXML) {
                        this.ktNets[ktnet.name] = new CEFKTNode_1.CEFKTNode;
                        this.ktNets[ktnet.name].loadXML(ktnet);
                    }
                }
                recurseXML(xmlNodes, xmlTar, newVal) {
                    let xml = xmlTar;
                    let ndx;
                    let len = xmlNodes.length;
                    let attr;
                    let node;
                    let value;
                    for (let nodeId = 0; nodeId < len; nodeId++) {
                        if (xmlNodes[nodeId] == '@') {
                            attr = xmlNodes[nodeId + 1];
                            if (this.traceMode)
                                CUtil_24.CUtil.trace(typeof (xml[attr]));
                            if (this.traceMode)
                                CUtil_24.CUtil.trace(xml[attr]);
                            (newVal != null) ? xml[attr] = value = newVal : value = xml[attr];
                            nodeId++;
                        }
                        else {
                            node = xmlNodes[nodeId];
                            if ((nodeId + 1) < len) {
                                attr = xmlNodes[nodeId + 1];
                                if (isNaN(Number(attr))) {
                                    xml = xml[node];
                                }
                                else {
                                    ndx = Number(attr);
                                    if ((nodeId + 2) < len)
                                        xml = xml[node][ndx];
                                    else
                                        (newVal != null) ? xml[node][ndx] = value = newVal : value = xml[node][ndx];
                                    nodeId++;
                                }
                            }
                            else
                                (newVal != null) ? xml[node] = value = newVal : value = xml[node];
                        }
                    }
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Final Result: " + value);
                    return value;
                }
                state(xmlSpec, newVal = null) {
                    let nodeArray;
                    nodeArray = xmlSpec.split(".");
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Node Array: " + nodeArray);
                    return this.recurseXML(nodeArray, CEFTutorRoot.gSceneConfig.state[0], newVal);
                }
                scene(xmlSpec, newVal = null) {
                    let nodeArray;
                    nodeArray = xmlSpec.split(".");
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Node Array: " + nodeArray);
                    return this.recurseXML(nodeArray, CEFTutorRoot.gSceneConfig.scenedata[0], newVal);
                }
                wozReplay() {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace(" wozReplay : ", this.playing.length);
                    this.wozStopPlay();
                    dispatchEvent(new Event(CEFRoot_19.CEFRoot.WOZCANCEL));
                    dispatchEvent(new Event(CEFRoot_19.CEFRoot.WOZREPLAY));
                }
                wozStopPlay() {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace(" wozStopPlay : ", this.playing.length);
                    let tCount = this.playing.length;
                    for (let i1 = 0; i1 < tCount; i1++) {
                        this.playing.pop();
                    }
                }
                wozPause() {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace(" wozPause : ", this.playing.length);
                    this.isPaused = true;
                    this.dispatchEvent(new Event(CEFTutorRoot.WOZPAUSING));
                    for (let i1 = 0; i1 < this.playing.length; i1++) {
                    }
                }
                wozPlay() {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace(" wozPlay : ", this.playing.length);
                    this.isPaused = false;
                    this.dispatchEvent(new Event(CEFTutorRoot.WOZPLAYING));
                    for (let i1 = 0; i1 < this.playing.length; i1++) {
                    }
                }
                playRemoveThis(wozObj) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace(" playRemoveThis : ", wozObj.name, this.playing.length);
                    for (let i1 = 0; i1 < this.playing.length; i1++) {
                        if (this.playing[i1] == wozObj) {
                            CEFDoc_3.CEFDoc.gApp.incStateID();
                            this.playing.splice(i1, 1);
                            break;
                        }
                    }
                }
                playAddThis(wozObj) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace(" playAddThis : ", wozObj.name, this.playing.length);
                    let fAdd = true;
                    for (let i1 = 0; i1 < this.playing.length; i1++) {
                        if (this.playing[i1] == wozObj) {
                            fAdd = false;
                            break;
                        }
                    }
                    if (fAdd)
                        this.playing.push(wozObj);
                }
                showPPlay(fShow) {
                    this.StitleBar.Spause.visible = fShow;
                }
                showReplay(fShow) {
                    this.StitleBar.Sreplay.visible = fShow;
                }
                setCursor(sMode) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("switching mouse ownership");
                    if (this.cCursor) {
                        this.cCursor.initWOZCursor(sMode);
                    }
                }
                replaceCursor() {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Creating Mouse Pointer");
                    if (!this.cCursor) {
                        this.cCursor = new CEFCursorProxy_1.CEFCursorProxy;
                        this.cCursor.visible = false;
                        CEFRoot_19.CEFRoot.gTutor.addChild(this.cCursor);
                    }
                    this.cCursor.initWOZCursor(CEFCursorProxy_1.CEFCursorProxy.WOZLIVE);
                    this.cCursor.show(false);
                }
                initAutomation(tutorObj) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Init Automation:");
                    this.xitions.connectToTutor(this, this.tutorAutoObj);
                    this.SnavPanel.connectToTutor(this, this.tutorAutoObj);
                }
                initializeScenes() {
                }
                captureDefState(Tutor) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("\t*** Start Capture - Walking Scenes***");
                    for (let scene in Tutor) {
                        if (this.traceMode)
                            CUtil_24.CUtil.trace("\tSCENE : " + scene);
                        if (scene != "instance" && Tutor[scene].instance instanceof CEFScene_5.CEFScene) {
                            Tutor[scene].instance.captureDefState(Tutor[scene]);
                        }
                    }
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("\t*** End Capture - Walking Scenes***");
                }
                restoreDefState(Tutor) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("\t*** Start Restore - Walking Scenes***");
                    for (let scene in Tutor) {
                        if (this.traceMode)
                            CUtil_24.CUtil.trace("\tSCENE : " + scene);
                        if (scene != "instance" && Tutor[scene].instance instanceof CEFScene_5.CEFScene) {
                            if (this.traceMode)
                                CUtil_24.CUtil.trace("reseting: " + scene);
                            Tutor[scene].instance.restoreDefState(Tutor[scene]);
                        }
                    }
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("\t*** End Restore - Walking Scenes***");
                }
                doPlayBack(pbSource) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("\t*** Start - Playback Stream ***");
                    this.cCursor.initWOZCursor(CEFCursorProxy_1.CEFCursorProxy.WOZREPLAY);
                    this.cCursor.setCursorStyle("Sautomate");
                    this.cCursor.setTopMost();
                    this.cCursor.show(true);
                    this.cCursor.initPlayBack();
                    this.stateStack.push(this.baseTime);
                    this.stateStack.push(CEFDoc_3.CEFDoc.gApp.stateID);
                    this.stateStack.push(CEFDoc_3.CEFDoc.gApp.frameID);
                    this.stateStack.push(this.gLogR.fLogging);
                    this.gLogR.fLogging = CLogManagerType_1.CLogManagerType.RECLOGNONE;
                    this.gLogR.setPlayBackSource(pbSource);
                    if (pbSource[0].version == "1") {
                        this.gLogR.normalizePlayBackTime();
                        this.baseTime = CUtil_24.CUtil.getTimer();
                        addEventListener(CEFEvent_8.CEFEvent.ENTER_FRAME, this.playBackByTime);
                        if (CEFTutorRoot.fDemo) {
                            this.stage.addEventListener(CEFKeyboardEvent_1.CEFKeyboardEvent.KEY_UP, this.abortPlayBack);
                            this.stage.addEventListener(CEFMouseEvent_6.CEFMouseEvent.CLICK, this.abortPlayBack2);
                        }
                    }
                    else if (pbSource[0].version == "2") {
                        this.gLogR.normalizePlayBack();
                        CEFDoc_3.CEFDoc.gApp.connectFrameCounter(false);
                        addEventListener(CEFEvent_8.CEFEvent.ENTER_FRAME, this.playBackByFrame);
                    }
                }
                replayStream(evt) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("\t*** Start - Replay Stream ***");
                    this.cCursor.initWOZCursor(CEFCursorProxy_1.CEFCursorProxy.WOZREPLAY);
                    this.cCursor.show(true);
                    this.cCursor.initPlayBack();
                    this.restoreDefState(this.tutorAutoObj);
                    this.stateStack.push(this.baseTime);
                    this.stateStack.push(CEFDoc_3.CEFDoc.gApp.stateID);
                    this.stateStack.push(CEFDoc_3.CEFDoc.gApp.frameID);
                    this.stateStack.push(this.gLogR.fLogging);
                    this.gLogR.fLogging = CLogManagerType_1.CLogManagerType.RECLOGNONE;
                    this.gLogR.setPlayBackSource(null);
                    this.gLogR.normalizePlayBack();
                    CEFDoc_3.CEFDoc.gApp.connectFrameCounter(false);
                    this.SnavPanel.goToScene("Sscene0");
                    addEventListener(CEFEvent_8.CEFEvent.ENTER_FRAME, this.playBackByFrame);
                }
                replayLiveStream() {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("\t*** Start - Replay Live Stream ***");
                    this.cCursor.initWOZCursor(CEFCursorProxy_1.CEFCursorProxy.WOZREPLAY);
                    this.cCursor.setCursorStyle("Sautomate");
                    this.cCursor.setTopMost();
                    this.cCursor.show(true);
                    this.cCursor.initPlayBack();
                    this.restoreDefState(this.tutorAutoObj);
                    this.stateStack.push(this.baseTime);
                    this.stateStack.push(CEFDoc_3.CEFDoc.gApp.stateID);
                    this.stateStack.push(CEFDoc_3.CEFDoc.gApp.frameID);
                    this.stateStack.push(this.gLogR.fLogging);
                    this.gLogR.fLogging = CLogManagerType_1.CLogManagerType.RECLOGNONE;
                    this.gLogR.setPlayBackSource(null);
                    this.gLogR.normalizePlayBack();
                    CEFDoc_3.CEFDoc.gApp.connectFrameCounter(false);
                    this.SnavPanel.goToScene("SstartSplash");
                    addEventListener(CEFEvent_8.CEFEvent.ENTER_FRAME, this.playBackByFrame);
                }
                abortPlayBack(evt) {
                    this.gLogR.setPlayBackDone(true);
                    dispatchEvent(new Event("interruptPlayBack"));
                }
                abortPlayBack2(evt) {
                    this.gLogR.setPlayBackDone(true);
                    dispatchEvent(new Event("interruptPlayBack"));
                }
                playBackByFrame(evt) {
                    let wozEvt = null;
                    let nextEventState;
                    if (this.gLogR.playBackDone()) {
                        if (this.traceMode)
                            CUtil_24.CUtil.trace("-- Playback Completed -- ");
                        removeEventListener(CEFEvent_8.CEFEvent.ENTER_FRAME, this.playBackByFrame);
                        this.cCursor.initWOZCursor(CEFCursorProxy_1.CEFCursorProxy.WOZLIVE);
                        this.cCursor.setCursorStyle("Sstandard");
                        this.cCursor.show(false);
                        dispatchEvent(new Event("endPlayBack"));
                        this.gLogR.fLogging = this.stateStack.pop();
                        CEFDoc_3.CEFDoc.gApp.frameID = this.stateStack.pop();
                        CEFDoc_3.CEFDoc.gApp.stateID = this.stateStack.pop();
                        this.baseTime = this.stateStack.pop();
                        CEFDoc_3.CEFDoc.gApp.connectFrameCounter(true);
                    }
                    else {
                        nextEventState = this.gLogR.getNextEventState();
                        if (this.traceMode)
                            CUtil_24.CUtil.trace("CEFDoc.gApp.stateID: " + CEFDoc_3.CEFDoc.gApp.stateID + "  - nextEventState:" + nextEventState);
                        {
                            do {
                                wozEvt = this.gLogR.getNextEvent(CEFDoc_3.CEFDoc.gApp.stateID, CEFDoc_3.CEFDoc.gApp.frameID);
                                if (wozEvt != null) {
                                    if (this.traceMode)
                                        CUtil_24.CUtil.trace("-- Executing Frame:" + CEFDoc_3.CEFDoc.gApp.frameID + " -- EVT -- " + wozEvt);
                                    this.cCursor.playBackAction(wozEvt);
                                }
                            } while (wozEvt != null);
                            CEFDoc_3.CEFDoc.gApp.incFrameID();
                        }
                    }
                }
                playBackByTime(evt) {
                    let frameTime = CUtil_24.CUtil.getTimer() - this.baseTime;
                    let wozEvt;
                    do {
                        wozEvt = this.gLogR.getActionEvent(frameTime);
                        if (wozEvt != null) {
                            this.cCursor.playBackAction(wozEvt);
                            if (this.traceMode)
                                CUtil_24.CUtil.trace("-- Executing Frame:" + frameTime + " -- EVT -- " + wozEvt);
                        }
                    } while (wozEvt != null);
                    wozEvt = this.gLogR.getMoveEvent(frameTime);
                    if (wozEvt != null)
                        this.cCursor.playBackMove(wozEvt, frameTime);
                    if (this.gLogR.playBackDone()) {
                        if (this.traceMode)
                            CUtil_24.CUtil.trace("-- Playback Completed -- ");
                        removeEventListener(CEFEvent_8.CEFEvent.ENTER_FRAME, this.playBackByTime);
                        this.cCursor.initWOZCursor(CEFCursorProxy_1.CEFCursorProxy.WOZLIVE);
                        this.cCursor.setCursorStyle("Sstandard");
                        this.cCursor.show(false);
                        dispatchEvent(new Event("endPlayBack"));
                        this.gLogR.fLogging = this.stateStack.pop();
                        CEFDoc_3.CEFDoc.gApp.frameID = this.stateStack.pop();
                        CEFDoc_3.CEFDoc.gApp.stateID = this.stateStack.pop();
                        this.baseTime = this.stateStack.pop();
                        CEFDoc_3.CEFDoc.gApp.connectFrameCounter(true);
                        if (CEFTutorRoot.fDemo) {
                            this.stage.removeEventListener(CEFKeyboardEvent_1.CEFKeyboardEvent.KEY_UP, this.abortPlayBack);
                            this.stage.removeEventListener(CEFMouseEvent_6.CEFMouseEvent.CLICK, this.abortPlayBack2);
                        }
                    }
                }
                dumpScenes(Tutor) {
                    for (let scene in Tutor) {
                        if (this.traceMode)
                            CUtil_24.CUtil.trace("\tSCENE : " + scene);
                        if (scene != "instance" && Tutor[scene].instance instanceof CEFObject_9.CEFObject) {
                            if (this.traceMode)
                                CUtil_24.CUtil.trace("\tCEF***");
                            Tutor[scene].instance.dumpSceneObjs(Tutor[scene]);
                        }
                    }
                }
                enumScenes() {
                    let sceneObj;
                    for (let i1 = 0; i1 < this.numChildren; i1++) {
                        sceneObj = this.getChildAt(i1);
                        CUtil_24.CUtil.trace(sceneObj.name + " is visible : " + ((sceneObj.visible) ? " true" : " false"));
                    }
                }
                enumChildren(scene, indentCnt) {
                    let sceneObj;
                    let indent = "";
                    for (let i2 = 0; i2 < indentCnt; i2++)
                        indent += "\t";
                    for (let i1 = 0; i1 < scene.numChildren; i1++) {
                        sceneObj = scene.getChildAt(i1);
                        CUtil_24.CUtil.trace(indent + sceneObj.name + " is visible : " + ((sceneObj.visible) ? " true" : " false") + " -alpha : " + sceneObj.alpha.toString() + "- x : " + sceneObj.x.toString() + " -y : " + sceneObj.y.toString() + " -width : " + sceneObj.width.toString() + " -height : " + sceneObj.height.toString());
                        if (sceneObj instanceof DisplayObjectContainer)
                            this.enumChildren(sceneObj, indentCnt + 1);
                    }
                }
                showNext(fshow) {
                    this.SnavPanel.SnextButton.showButton(fshow);
                }
                enableNext(fEnable) {
                    this.SnavPanel.SnextButton.enableButton(fEnable);
                }
                enableBack(fEnable) {
                    this.SnavPanel.SbackButton.enableButton(fEnable);
                }
                questionStart(evt) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Start of Question: ");
                }
                questionComplete(evt) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Question Complete: ");
                }
                goBackScene(evt) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Force Decrement Question: ");
                    this.SnavPanel.onButtonPrev(null);
                }
                goNextScene(evt) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Force Increment Question: ");
                    this.SnavPanel.gotoNextScene();
                }
                goToScene(evt) {
                    if (this.traceMode)
                        CUtil_24.CUtil.trace("Force Increment Question: ");
                    this.SnavPanel.goToScene(evt.wozNavTarget);
                }
            };
            exports_57("CEFTutorRoot", CEFTutorRoot);
        }
    };
});
System.register("network/ILogManager", [], function (exports_58, context_58) {
    "use strict";
    var __moduleName = context_58 && context_58.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("core/CEFObjectDyno", ["core/CEFRoot", "core/CEFObject", "util/CUtil"], function (exports_59, context_59) {
    "use strict";
    var __moduleName = context_59 && context_59.id;
    var CEFRoot_20, CEFObject_10, CUtil_25, CEFObjectDyno;
    return {
        setters: [
            function (CEFRoot_20_1) {
                CEFRoot_20 = CEFRoot_20_1;
            },
            function (CEFObject_10_1) {
                CEFObject_10 = CEFObject_10_1;
            },
            function (CUtil_25_1) {
                CUtil_25 = CUtil_25_1;
            }
        ],
        execute: function () {
            CEFObjectDyno = class CEFObjectDyno extends CEFRoot_20.CEFRoot {
                constructor() {
                    super();
                }
                initAutomation(_parentScene, sceneObj, ObjIdRef, lLogger, lTutor) {
                    if (this.traceMode)
                        CUtil_25.CUtil.trace("CEFObjectDyno initAutomation:");
                    var subObj;
                    var wozObj;
                    this.objID = ObjIdRef + name;
                    for (var i1 = 0; i1 < this.numChildren; i1++) {
                        subObj = this.getChildAt(i1);
                        if (subObj instanceof CEFObject_10.CEFObject || subObj instanceof CEFObjectDyno) {
                            subObj.parentScene = _parentScene;
                        }
                    }
                }
            };
            exports_59("CEFObjectDyno", CEFObjectDyno);
        }
    };
});
System.register("core/CEFObject", ["core/CEFRoot", "core/CEFObjectDyno", "core/CEFAnimator", "events/CEFEvent", "util/CUtil"], function (exports_60, context_60) {
    "use strict";
    var __moduleName = context_60 && context_60.id;
    var CEFRoot_21, CEFObjectDyno_1, CEFAnimator_2, CEFEvent_9, CUtil_26, Tween, ColorMatrixFilter, BlurFilter, Ease, CEFObject;
    return {
        setters: [
            function (CEFRoot_21_1) {
                CEFRoot_21 = CEFRoot_21_1;
            },
            function (CEFObjectDyno_1_1) {
                CEFObjectDyno_1 = CEFObjectDyno_1_1;
            },
            function (CEFAnimator_2_1) {
                CEFAnimator_2 = CEFAnimator_2_1;
            },
            function (CEFEvent_9_1) {
                CEFEvent_9 = CEFEvent_9_1;
            },
            function (CUtil_26_1) {
                CUtil_26 = CUtil_26_1;
            }
        ],
        execute: function () {
            Tween = createjs.Tween;
            ColorMatrixFilter = createjs.ColorMatrixFilter;
            BlurFilter = createjs.BlurFilter;
            Ease = createjs.Ease;
            CEFObject = class CEFObject extends CEFAnimator_2.CEFAnimator {
                constructor() {
                    super();
                    this.sAuto = "UNKNOWN";
                    this.satFrames = 8;
                    this.satIncrement = 1 / this.satFrames;
                    this.curSat = 1.0;
                    this.curBlur = 1.0;
                    this.blurFrames = 8;
                    this.blurIncrement = 1 / this.blurFrames;
                    this.curGlow = 1.0;
                    this.glowFrames = 8;
                    this.glowIncrement = 1 / this.glowFrames;
                    this._isvalid = "false";
                    this._ischecked = "false";
                    this._activeFeature = "";
                    this._validFeature = "";
                    this._invalidFeature = "";
                    this._sceneData = new Object;
                    this._phaseData = new Object;
                    this._hasClickMask = false;
                    this._hidden = false;
                    this.onCreateScript = null;
                    this.onExitScript = null;
                    this.traceMode = false;
                    if (this.traceMode)
                        CUtil_26.CUtil.trace("CEFObject:Constructor");
                    this.tweenID = 1;
                    this.bTweenable = true;
                    this.bSubTweenable = false;
                    this.bPersist = false;
                }
                onCreate() {
                    if ((CEFRoot_21.CEFRoot.gSceneConfig != null) && (CEFRoot_21.CEFRoot.gSceneConfig.objectdata[name] != undefined))
                        this.parseOBJ(this, CEFRoot_21.CEFRoot.gSceneConfig.objectdata[name].children(), name);
                    if (this.onCreateScript != null)
                        this.doCreateAction();
                }
                doCreateAction() {
                    try {
                        eval(this.onCreateScript);
                    }
                    catch (e) {
                        CUtil_26.CUtil.trace("Error in onCreate script: " + this.onCreateScript);
                    }
                }
                doExitAction() {
                    if (this.onExitScript != null) {
                        try {
                            eval(this.onExitScript);
                        }
                        catch (e) {
                            CUtil_26.CUtil.trace("Error in onExit script: " + this.onExitScript);
                        }
                    }
                }
                incFrameNdx() {
                    CEFObject._framendx++;
                }
                set hidden(hide) {
                    this._hidden = hide;
                    if (this._hidden) {
                        this.visible = false;
                        this.alpha = 0;
                    }
                }
                get hidden() {
                    return this._hidden;
                }
                set features(newFTR) {
                    this._features = newFTR;
                }
                get features() {
                    return this._features;
                }
                setANDFeature(newFTR) {
                    if (this._features.length != 0)
                        this._features += ",";
                    this._features += newFTR;
                }
                setORFeature(newFTR) {
                    if (this._features.length != 0)
                        this._features += ":";
                    this._features += newFTR;
                }
                unSetFeature(ftr) {
                    let feature;
                    let featArray = new Array;
                    let updatedFTRset = "";
                    if (this._features.length > 0)
                        featArray = this._features.split(":");
                    for (let feature of featArray) {
                        if (feature != ftr) {
                            if (updatedFTRset.length != 0)
                                updatedFTRset += ":";
                            updatedFTRset += ftr;
                        }
                    }
                    this._features = updatedFTRset;
                }
                buildObject(objectClass, objectName) {
                    let newObject;
                    let maskDim;
                    let ClassRef = CEFRoot_21.CEFRoot.getDefinitionByName(objectClass);
                    newObject = new ClassRef();
                    newObject.name = objectName;
                    newObject.onCreate();
                    this.addChild(newObject);
                    if (newObject._hasClickMask) {
                        maskDim = newObject.globalToLocal(0, 0);
                        newObject.SclickMask.x = maskDim.x;
                        newObject.SclickMask.y = maskDim.y;
                        newObject.SclickMask.graphics.setStrokeStyle(0);
                        newObject.SclickMask.graphics.beginFill(newObject._maskColor);
                        newObject.SclickMask.graphics.drawRect(0, 0, CEFObject.STAGEWIDTH, CEFObject.STAGEHEIGHT);
                        newObject.SclickMask.graphics.endFill();
                    }
                    return newObject;
                }
                buildMask() {
                }
                get activeFeature() {
                    return "";
                }
                set activeFeature(value) {
                }
                clearAllEffects(fHide = true) {
                    this.stopTransitions();
                    removeEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.saturationTimer);
                    removeEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.blurTimer);
                    removeEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.flashTimer);
                    this.filters = null;
                    if (fHide)
                        this.alpha = 0;
                }
                moveChild(tarObj, moveX, moveY, duration = "0.5") {
                    if (moveX != "")
                        this.Running.push(new Tween(this[tarObj]).to({ x: moveX }, Number(duration), Ease.cubicInOut));
                    if (moveY != "")
                        this.Running.push(new Tween(this[tarObj]).to({ y: moveY }, Number(duration), Ease.cubicInOut));
                }
                moveOriginChild(tarObj, regx, regy, duration = "0.5") {
                    if (regx != "")
                        this.Running.push(new Tween(this[tarObj]).to({ regX: regx }, Number(duration), Ease.cubicInOut));
                    if (regy != "")
                        this.Running.push(new Tween(this[tarObj]).to({ regY: regy }, Number(duration), Ease.cubicInOut));
                }
                scaleChild(tarObj, scalex, scaley, duration = "0.5") {
                    if (scalex != "")
                        this.Running.push(new Tween(this[tarObj]).to({ scaleX: scalex }, Number(duration), Ease.cubicInOut));
                    if (scaley != "")
                        this.Running.push(new Tween(this[tarObj]).to({ scaleY: scaley }, Number(duration), Ease.cubicInOut));
                }
                saturateChild(tarObj, newState, duration = "0.08") {
                    this[tarObj].saturateObj(newState, duration);
                }
                saturateChildTo(tarObj, newSat, duration = "0.08") {
                    this[tarObj].saturateObjTo(newSat, duration);
                }
                saturateObj(newState, duration = "0.08") {
                    this.newSaturation = newState;
                    if (this.newSaturation == "mono") {
                        this.curSat = 1.0;
                        this.newSat = 0.0;
                    }
                    else {
                        this.curSat = 0.0;
                        this.newSat = 1.0;
                    }
                    this.satIncrement = 1.0 / 12;
                    addEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.saturationTimer);
                }
                saturateObjTo(_newSat, duration = "0.08") {
                    let dynRange;
                    if (_newSat > this.curSat) {
                        this.newSaturation = "color";
                    }
                    else {
                        this.newSaturation = "mono";
                    }
                    this.newSat = _newSat;
                    dynRange = Math.abs(_newSat - this.curSat);
                    this.satIncrement = dynRange / 12;
                    addEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.saturationTimer);
                }
                saturationTimer(evt) {
                    if (this.newSaturation == "color") {
                        this.curSat += this.satIncrement;
                        if (this.curSat >= this.newSat) {
                            this.curSat = this.newSat;
                            removeEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.saturationTimer);
                        }
                    }
                    else if (this.newSaturation == "mono") {
                        this.curSat -= this.satIncrement;
                        if (this.curSat <= this.newSat) {
                            this.curSat = this.newSat;
                            removeEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.saturationTimer);
                        }
                    }
                    else {
                        this.curSat = 1.0;
                        removeEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.saturationTimer);
                    }
                    this.filters = new Array(this.adjustSaturation(Number(this.curSat)));
                }
                adjustSaturation(s = 1) {
                    let sInv;
                    let irlum;
                    let iglum;
                    let iblum;
                    sInv = (1 - s);
                    irlum = (sInv * CEFObject.LUMA_R);
                    iglum = (sInv * CEFObject.LUMA_G);
                    iblum = (sInv * CEFObject.LUMA_B);
                    return new ColorMatrixFilter([(irlum + s), iglum, iblum, 0, 0,
                        irlum, (iglum + s), iblum, 0, 0,
                        irlum, iglum, (iblum + s), 0, 0,
                        0, 0, 0, 1, 0]);
                }
                blurChild(tarObj, duration = "12") {
                    this[tarObj].blurObj(duration);
                }
                blurObj(duration = "12") {
                    this.blurIncrement = 255.0 / Number(duration);
                    this.curBlur = 0;
                    addEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.blurTimer);
                }
                blurTimer(evt) {
                    this.curBlur += this.blurIncrement;
                    if (this.curBlur >= 255) {
                        removeEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.blurTimer);
                        dispatchEvent(new Event("blur_complete"));
                        this.filters = null;
                        this.alpha = 0;
                    }
                    else
                        this.filters = new Array(new BlurFilter(this.curBlur, this.curBlur));
                }
                flashChild(tarObj, _glowColor, duration = "8") {
                    this[tarObj].flashObj(_glowColor, duration);
                }
                flashObj(_glowColor, duration = "8") {
                    this.glowStage = "color";
                    this.glowColor = _glowColor;
                    this.glowStrength = 2.0;
                    this.glowAlpha = 1.0;
                    this.glowIncrement = 175.0 / Number(duration);
                    this.curGlow = 0;
                    if (this.traceMode)
                        CUtil_26.CUtil.trace("start Object Flash");
                    addEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.flashTimer);
                }
                flashTimer(evt) {
                    if (this.glowStage == "color") {
                        this.curGlow += this.glowIncrement;
                        this.glowStrength += .1;
                        if (this.curGlow >= 175) {
                            this.glowStage = "alpha";
                        }
                    }
                    else if (this.glowStage == "alpha") {
                        if (this.glowAlpha <= 0.0) {
                            if (this.traceMode)
                                CUtil_26.CUtil.trace("end Object Flash");
                            removeEventListener(CEFEvent_9.CEFEvent.ENTER_FRAME, this.flashTimer);
                            dispatchEvent(new Event("glow_complete"));
                            this.glowStage = "done";
                            this.filters = null;
                        }
                        this.glowAlpha -= .05;
                    }
                }
                showChild(tarObj, alphaTo = -1, autoStart = false) {
                    this[tarObj].visible = true;
                    if (alphaTo != -1)
                        this[tarObj].alpha = alphaTo;
                }
                hideChild(tarObj) {
                    this[tarObj].visible = false;
                }
                fadeChildOff(tarObj, autoStart = false, duration = "0.5") {
                    this._tarObj = tarObj;
                    this.Running.push(new Tween(this[tarObj]).to({ alpha: 0 }, Number(duration), Ease.cubicInOut));
                    if (autoStart)
                        this.startTransition(this.hideDone);
                }
                hideDone() {
                    this[this._tarObj].visible = false;
                }
                fadeChild(tarObj, alphaTo, autoStart = false, duration = "0.5") {
                    this[tarObj].visible = true;
                    switch (alphaTo) {
                        case "off":
                        case "on":
                            if (this.traceMode)
                                CUtil_26.CUtil.trace("Fading : ", tarObj, alphaTo);
                            this.Running.push(new Tween(this[tarObj]).to({ alpha: (alphaTo == "on") ? 1 : 0 }, Number(duration), Ease.cubicInOut));
                            if (autoStart == true)
                                this.startTransition(this.twnDone);
                            break;
                        default:
                            if (this.traceMode)
                                CUtil_26.CUtil.trace("fadeChild: Parameter error - should be 'on' or 'off' - is: ", alphaTo);
                            break;
                    }
                }
                fadeChildTo(tarObj, alphaTo, autoStart = false, duration = "0.5") {
                    this[tarObj].visible = true;
                    if (this.traceMode)
                        CUtil_26.CUtil.trace("Fading To: ", tarObj, alphaTo);
                    this.Running.push(new Tween(this[tarObj]).to({ alpha: alphaTo }, Number(duration), Ease.cubicInOut));
                    if (autoStart == true)
                        this.startTransition(this.twnDone);
                }
                twnDone() {
                }
                startTween(xnF = this.twnDone) {
                    if (this.Running.length > 0)
                        this.startTransition((xnF == null) ? this.twnDone : xnF);
                }
                deepStateCopy(src) {
                    this.rotation = src.rotation;
                    this.x = src.x;
                    this.y = src.y;
                    this.scaleX = src.scaleX;
                    this.scaleY = src.scaleY;
                    this.alpha = src.alpha;
                    this.visible = src.visible;
                    this.bPersist = src.bPersist;
                    this.activeFeature = src.activeFeature;
                }
                shallowStateCopy(tar, src) {
                    tar.rotation = src.rotation;
                    tar.x = src.x;
                    tar.y = src.y;
                    tar.scaleX = src.scaleX;
                    tar.scaleY = src.scaleY;
                    tar.alpha = src.alpha;
                    tar.visible = src.visible;
                }
                captureDefState(tutObject) {
                    this.defRot = this.rotation;
                    this.defX = this.x;
                    this.defY = this.y;
                    this.defWidth = this.scaleX;
                    this.defHeight = this.scaleY;
                    this.defAlpha = this.alpha;
                    for (let subObject in tutObject) {
                        if (subObject != "instance" && tutObject[subObject].instance instanceof CEFObject) {
                            if (this.traceMode)
                                CUtil_26.CUtil.trace("capturing: " + tutObject[subObject].instance.name);
                            tutObject[subObject].instance.captureDefState(tutObject[subObject]);
                        }
                    }
                }
                restoreDefState(tutObject) {
                    this.rotation = this.defRot;
                    this.scaleX = this.defWidth;
                    this.scaleY = this.defHeight;
                    this.x = this.defX;
                    this.y = this.defY;
                    this.alpha = this.defAlpha;
                    for (let subObject in tutObject) {
                        if (subObject != "instance" && tutObject[subObject].instance instanceof CEFObject) {
                            if (this.traceMode)
                                CUtil_26.CUtil.trace("restoring: " + tutObject[subObject].instance.name);
                            tutObject[subObject].instance.restoreDefState(tutObject[subObject]);
                        }
                    }
                }
                isTweenable() {
                    return this.bTweenable;
                }
                isSubTweenable() {
                    return this.bSubTweenable;
                }
                captureLogState(obj = null) {
                    if (obj == null)
                        obj = new Object;
                    return obj;
                }
                captureXMLState() {
                    let nullXML = '<null/>';
                    return nullXML;
                }
                restoreXMLState(xmlState) {
                }
                compareXMLState(xmlState) {
                    return false;
                }
                createLogAttr(objprop, restart = false) {
                    let sResult;
                    if (!this.hasOwnProperty(objprop))
                        sResult = "undefined";
                    else
                        sResult = this[objprop];
                    return sResult;
                }
                measure() {
                }
                initAutomation(_parentScene, sceneObj, ObjIdRef, lLogger, lTutor) {
                    if (this.traceMode)
                        CUtil_26.CUtil.trace("CEFObject initAutomation:");
                    let subObj;
                    let wozObj;
                    this.objID = ObjIdRef + name;
                    for (let i1 = 0; i1 < this.numChildren; i1++) {
                        subObj = this.getChildAt(i1);
                        sceneObj[subObj.name] = new Object;
                        sceneObj[subObj.name].instance = subObj;
                        if (subObj instanceof CEFObject || subObj instanceof CEFObjectDyno_1.CEFObjectDyno) {
                            subObj.parentScene = _parentScene;
                            if (subObj instanceof CEFObject)
                                subObj.measure();
                        }
                        sceneObj[subObj.name]['inPlace'] = { X: subObj.x, Y: subObj.y, Width: subObj.scaleX, Height: subObj.scaleY, Alpha: subObj.alpha };
                        if (this.traceMode)
                            CUtil_26.CUtil.trace("\t\tCEFObject found subObject named:" + subObj.name);
                        if (subObj instanceof CEFObject) {
                            wozObj = subObj;
                            wozObj.initAutomation(_parentScene, sceneObj[subObj.name], this.objID + ".", lLogger, lTutor);
                        }
                        if (subObj instanceof CEFObjectDyno_1.CEFObjectDyno) {
                            let wozDynoObj = subObj;
                            wozDynoObj.initAutomation(_parentScene, sceneObj[subObj.name], this.objID + ".", lLogger, lTutor);
                        }
                    }
                }
                setAutomationMode(sceneObj, sMode) {
                    this.sAuto = sMode;
                    for (let subObj in sceneObj) {
                        if (subObj != "instance" && sceneObj[subObj].instance instanceof CEFObject) {
                            sceneObj[subObj].instance.setAutomationMode(sceneObj[subObj], sMode);
                        }
                    }
                }
                dumpSubObjs(sceneObj, Indent) {
                    for (let subObj in sceneObj) {
                        if (this.traceMode)
                            CUtil_26.CUtil.trace(Indent + "\tsubObj : " + subObj);
                        if (subObj != "instance") {
                            let ObjData = sceneObj[subObj];
                            if (sceneObj[subObj].instance instanceof CEFObject) {
                                if (this.traceMode)
                                    CUtil_26.CUtil.trace(Indent + "\t");
                                let wozObj = sceneObj[subObj].instance;
                                if (ObjData['inPlace'] != undefined) {
                                    if (this.traceMode)
                                        CUtil_26.CUtil.trace(Indent + "\tCEF* Object: " + " x: " + wozObj.x + " y: " + wozObj.y + " width: " + wozObj.scaleX + " height: " + wozObj.scaleY + " alpha: " + wozObj.alpha + " visible: " + wozObj.visible + " name: " + wozObj.name);
                                    if (this.traceMode)
                                        CUtil_26.CUtil.trace(Indent + "\tIn-Place Pos: " + " X: " + ObjData['inPlace'].X + " Y: " + ObjData['inPlace'].Y + " Width: " + ObjData['inPlace'].scaleX + " Height: " + ObjData['inPlace'].scaleY + " Alpha: " + ObjData['inPlace'].Alpha);
                                }
                                sceneObj[subObj].instance.dumpSubObjs(sceneObj[subObj], Indent + "\t");
                            }
                            else {
                                let disObj = sceneObj[subObj].instance;
                                if (ObjData['inPlace'] != undefined) {
                                    if (this.traceMode)
                                        CUtil_26.CUtil.trace(Indent + "\tFlash Object: " + " x: " + disObj.x + " y: " + disObj.y + " width: " + disObj.scaleX + " height: " + disObj.scaleY + " alpha: " + disObj.alpha + " visible: " + disObj.visible + " name: " + disObj.name);
                                    if (this.traceMode)
                                        CUtil_26.CUtil.trace(Indent + "\tIn-Place Pos: " + " X: " + ObjData['inPlace'].X + " Y: " + ObjData['inPlace'].Y + " Width: " + ObjData['inPlace'].scaleX + " Height: " + ObjData['inPlace'].scaleY + " Alpha: " + ObjData['inPlace'].Alpha);
                                }
                            }
                        }
                        else {
                            if (this.traceMode)
                                CUtil_26.CUtil.trace(Indent + "Parent Object : " + sceneObj + " visible: " + sceneObj[subObj].visible);
                        }
                    }
                }
                set isChecked(sval) {
                    this._ischecked = sval;
                }
                get isChecked() {
                    return this._ischecked;
                }
                set checked(bval) {
                    this._ischecked = (bval) ? "true" : "false";
                }
                get checked() {
                    return (this._ischecked == "true") ? true : false;
                }
                set isValid(sval) {
                    this._isvalid = sval;
                }
                get isValid() {
                    return this._isvalid;
                }
                assertFeatures() {
                    return "";
                }
                retractFeatures() {
                }
                get tallyValid() {
                    return "0";
                }
                assertFeature(_feature) {
                    if (_feature != "")
                        CEFRoot_21.CEFRoot.gTutor.addFeature = _feature;
                }
                retractFeature(_feature) {
                    if (_feature != "")
                        CEFRoot_21.CEFRoot.gTutor.delFeature = _feature;
                }
                static initGlobals() {
                    CEFObject._globals = new Object;
                }
                incrGlobal(_id, _max = -1, _cycle = 0) {
                    let result;
                    if (CEFObject._globals.hasOwnProperty(_id)) {
                        CEFObject._globals[_id]++;
                        result = CEFObject._globals[_id];
                        if (CEFObject._globals[_id] == _max)
                            CEFObject._globals[_id] = _cycle;
                    }
                    else
                        result = CEFObject._globals[_id] = 1;
                    return result;
                }
                assertGlobal(_id, _value) {
                    CEFObject._globals[_id] = _value;
                }
                retractGlobal(_id) {
                    CEFObject._globals[_id] = "";
                }
                queryGlobal(_id) {
                    let result;
                    if (CEFObject._globals.hasOwnProperty(_id)) {
                        result = CEFObject._globals[_id];
                    }
                    else
                        result = "null";
                    return result;
                }
                set globals(gval) {
                    CEFObject._globals = gval;
                }
                get globals() {
                    return CEFObject._globals;
                }
                set valid(bval) {
                    this._isvalid = (bval) ? "true" : "false";
                }
                get valid() {
                    return (this._isvalid == "true") ? true : false;
                }
                wozMouseClick(evt) {
                    this.dispatchEvent(evt);
                }
                wozMouseMove(evt) {
                    this.dispatchEvent(evt);
                }
                wozMouseDown(evt) {
                    this.dispatchEvent(evt);
                }
                wozMouseUp(evt) {
                    this.dispatchEvent(evt);
                }
                wozMouseOver(evt) {
                    this.dispatchEvent(evt);
                }
                wozMouseOut(evt) {
                    this.dispatchEvent(evt);
                }
                wozKeyDown(evt) {
                    this.dispatchEvent(evt);
                }
                wozKeyUp(evt) {
                    this.dispatchEvent(evt);
                }
                decodeTarget(baseObj, objArray) {
                    var tmpObject = baseObj;
                    var subObject;
                    subObject = objArray.shift();
                    if (this.traceMode)
                        CUtil_26.CUtil.trace("decoding: " + subObject);
                    if (subObject != "this") {
                        tmpObject = baseObj[subObject];
                        if (objArray.length)
                            tmpObject = this.decodeTarget(tmpObject, objArray);
                    }
                    return tmpObject;
                }
                parseOBJLog(tarObj, element) {
                    var objArray;
                    var dataStr;
                    var attrName;
                    if (this.traceMode)
                        CUtil_26.CUtil.trace("Processing: " + element.localName() + " - named: " + element.named);
                    objArray = element.objname.split(".");
                    if (this.traceMode)
                        CUtil_26.CUtil.trace("Target Array: " + objArray[0]);
                    if (objArray.length)
                        tarObj = this.decodeTarget(tarObj, objArray);
                    if (element.objprop != undefined) {
                        dataStr = tarObj.createLogAttr(element.objprop);
                    }
                    else if (element.objmethod != undefined) {
                        dataStr = tarObj.runXMLFunction(tarObj, element);
                    }
                    attrName = this.constructLogName(element.logattr);
                    this.navigator._phaseData[attrName] = new Object;
                    this.navigator._phaseData[attrName]['value'] = dataStr;
                    this.navigator._phaseData[attrName]["start"] = CEFRoot_21.CEFRoot.gTutor.timeStamp.getStartTime("dur_" + name);
                    this.navigator._phaseData[attrName]["duration"] = CEFRoot_21.CEFRoot.gTutor.timeStamp.createLogAttr("dur_" + name);
                    this._sceneData[element.logattr] = dataStr;
                    this._sceneData['phasename'] = element.logid.toString();
                    try {
                        this._sceneData['Rule0'] = CEFRoot_21.CEFRoot.gTutor.ktSkills['rule0'].queryBelief();
                        this._sceneData['Rule1'] = CEFRoot_21.CEFRoot.gTutor.ktSkills['rule1'].queryBelief();
                        this._sceneData['Rule2'] = CEFRoot_21.CEFRoot.gTutor.ktSkills['rule2'].queryBelief();
                    }
                    catch (err) {
                        CUtil_26.CUtil.trace("Error - CVS Skills not defined:" + err);
                    }
                    return;
                }
                constructLogName(attr) {
                    var attrName = "L00000";
                    var frame;
                    frame = CEFObject._framendx.toString();
                    attrName = name + "_" + attr + "_" + CEFRoot_21.CEFRoot.gTutor.gNavigator.iteration.toString();
                    return attrName;
                }
                setXMLProperty(tarObj, tarXML) {
                    if (this.traceMode)
                        CUtil_26.CUtil.trace("Processing: " + tarXML.localName() + " - named: " + tarXML.named + "- value: " + tarXML.value);
                    if (tarObj.hasOwnProperty(tarXML.prop)) {
                        var parmDef = tarXML.value.split(":");
                        if (parmDef[1] != "null") {
                            if (parmDef[1] == "Array") {
                                tarObj[tarXML.prop] = parmDef[0].split(",");
                            }
                            else {
                                var tClass = CEFRoot_21.CEFRoot.getDefinitionByName(parmDef[1]);
                                var value = parmDef[0];
                                tarObj[tarXML.prop] = new tClass(value);
                            }
                        }
                        else
                            tarObj[tarXML.prop] = null;
                    }
                }
                runXMLFunction(tarObj, tarXML) {
                    var i1 = 1;
                    var tClass;
                    var value;
                    var objArray;
                    var parmDef;
                    var parms = new Array;
                    while (tarXML["parm" + i1] != undefined) {
                        parmDef = tarXML["parm" + i1].split(":");
                        if (parmDef[1] == "symbol") {
                            objArray = parmDef[0].split(".");
                            if (objArray.length)
                                parms.push(this.decodeTarget(tarObj, objArray));
                        }
                        else if (parmDef[1] != "null") {
                            tClass = CEFRoot_21.CEFRoot.getDefinitionByName(parmDef[1]);
                            value = parmDef[0];
                            parms.push(new tClass(value));
                        }
                        else
                            parms.push(null);
                        i1++;
                    }
                    if (tarXML.cmnd != undefined)
                        return tarObj[tarXML.cmnd].apply(tarObj, (parms));
                    if (tarXML.objmethod != undefined)
                        return tarObj[tarXML.objmethod].apply(tarObj, (parms));
                }
                parseOBJ(tarObj, tarXML, xType) {
                    var tarObject;
                    var childList;
                    var objArray;
                    var element;
                    if (this.traceMode)
                        CUtil_26.CUtil.trace("Parsing:" + tarXML[0].localName() + " - named: " + tarXML[0].named + " - Count: " + tarXML.length());
                    for (element of tarXML) {
                        tarObject = tarObj;
                        if (element.features != undefined) {
                            if (!CEFRoot_21.CEFRoot.gTutor.testFeatureSet(String(element.features)))
                                continue;
                        }
                        try {
                            switch (element.localName()) {
                                case "common":
                                    this.parseOBJ(tarObj, CEFObject.gSceneConfig.scenedata[element.text()][xType].children(), xType);
                                    break;
                                case "log":
                                    this.parseOBJLog(tarObject, element);
                                    break;
                                case "obj":
                                    if (this.traceMode)
                                        CUtil_26.CUtil.trace("Processing: " + element.localName() + " - named: " + element.named);
                                    try {
                                        objArray = element.named.split(".");
                                        if (this.traceMode)
                                            CUtil_26.CUtil.trace("Target Array: " + objArray[0]);
                                        if (objArray.length)
                                            tarObject = this.decodeTarget(tarObject, objArray);
                                        childList = element.children();
                                        if (childList.length > 0)
                                            this.parseOBJ(tarObject, childList, "obj");
                                        if (element.prop != undefined) {
                                            this.setXMLProperty(tarObject, element);
                                        }
                                        else if (element.cmnd != undefined) {
                                            this.runXMLFunction(tarObject, element);
                                        }
                                    }
                                    catch (err) {
                                        if (this.traceMode)
                                            CUtil_26.CUtil.trace("Invalid 'obj' target");
                                    }
                                    break;
                                case "props":
                                    if (this.traceMode)
                                        CUtil_26.CUtil.trace("Processing: " + element.localName() + " - named: " + element.named + "- value: " + element.value);
                                    this.setXMLProperty(tarObject, element);
                                    break;
                                case "cmnds":
                                    if (this.traceMode)
                                        CUtil_26.CUtil.trace("Processing: " + element.localName() + " - named: " + element.named + "- value: " + element.value);
                                    this.runXMLFunction(tarObject, element);
                                    break;
                                case "symbol":
                                    try {
                                        objArray = element.named.split(".");
                                        if (this.traceMode)
                                            CUtil_26.CUtil.trace("Target Array: " + objArray[0]);
                                        if (objArray.length)
                                            tarObject = this.decodeTarget(tarObject, objArray);
                                    }
                                    catch (err) {
                                        CUtil_26.CUtil.trace("ParseXML Symbol named: " + element.named + " not found.");
                                        tarObject = null;
                                    }
                                    if (tarObject != null) {
                                        tarObject.loadXML(element);
                                    }
                                    break;
                                case "object":
                                    if (this.hasOwnProperty(element.named) && (this[element.named] != null))
                                        this[element.named].parseXML(this[element.named], CEFObject.gSceneConfig.objectdata[element.named].children(), "object");
                                    break;
                                case "initself":
                                    this.loadXML(element);
                                    break;
                            }
                        }
                        catch (err) {
                            CUtil_26.CUtil.trace("CEFObject:parseXML: " + err);
                        }
                    }
                }
                loadOBJ(xmlSrc) {
                    this._XMLsrc = xmlSrc;
                    if (xmlSrc.wozname != undefined)
                        this.wozName = xmlSrc.wozname;
                    if (xmlSrc.x != undefined)
                        this.x = Number(xmlSrc.x);
                    if (xmlSrc.y != undefined)
                        this.y = Number(xmlSrc.y);
                    if (xmlSrc.visible != undefined) {
                        this.visible = (xmlSrc.visible == "true") ? true : false;
                    }
                    if (xmlSrc.alpha != undefined)
                        this.alpha = Number(xmlSrc.alpha);
                    if (xmlSrc.mask != undefined) {
                        this._hasClickMask = true;
                        this.addChildAt(this.SclickMask, 0);
                    }
                    if (xmlSrc.oncreate != undefined) {
                        try {
                        }
                        catch (err) {
                            CUtil_26.CUtil.trace("Error: onCreateScript Invalid: " + xmlSrc.oncreate);
                        }
                    }
                    if (xmlSrc.onexit != undefined) {
                        try {
                        }
                        catch (err) {
                            CUtil_26.CUtil.trace("Error: onExitScript Invalid: " + xmlSrc.onExitScript);
                        }
                    }
                    super.loadXML(xmlSrc);
                }
            };
            CEFObject.CANCELNAV = "CancelNav";
            CEFObject.OKNAV = "OK";
            CEFObject.LUMA_R = 0.212671;
            CEFObject.LUMA_G = 0.71516;
            CEFObject.LUMA_B = 0.072169;
            CEFObject._globals = new Object;
            CEFObject._framendx = 0;
            exports_60("CEFObject", CEFObject);
        }
    };
});
System.register("events/CEFSeekEvent", ["util/CUtil"], function (exports_61, context_61) {
    "use strict";
    var __moduleName = context_61 && context_61.id;
    var Event, CUtil_27, CEFSeekEvent;
    return {
        setters: [
            function (CUtil_27_1) {
                CUtil_27 = CUtil_27_1;
            }
        ],
        execute: function () {
            Event = createjs.Event;
            CEFSeekEvent = class CEFSeekEvent extends Event {
                constructor(type, SeekSeq, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                    this.wozSeekSeq = SeekSeq;
                }
                clone() {
                    CUtil_27.CUtil.trace("cloning CEFSeekEvent:");
                    return new CEFSeekEvent(this.type, this.wozSeekSeq, this.bubbles, this.cancelable);
                }
            };
            CEFSeekEvent.SEEKFORWARD = "WOZSEEKF";
            CEFSeekEvent.SEEKBACKWARD = "WOZSEEKB";
            exports_61("CEFSeekEvent", CEFSeekEvent);
        }
    };
});
System.register("core/CEFScene", ["core/CEFRoot", "core/CEFObject", "util/CUtil"], function (exports_62, context_62) {
    "use strict";
    var __moduleName = context_62 && context_62.id;
    var CEFRoot_22, CEFObject_11, CUtil_28, CEFScene;
    return {
        setters: [
            function (CEFRoot_22_1) {
                CEFRoot_22 = CEFRoot_22_1;
            },
            function (CEFObject_11_1) {
                CEFObject_11 = CEFObject_11_1;
            },
            function (CUtil_28_1) {
                CUtil_28 = CUtil_28_1;
            }
        ],
        execute: function () {
            CEFScene = class CEFScene extends CEFObject_11.CEFObject {
                constructor() {
                    super(...arguments);
                    this.fComplete = false;
                    this.sceneAttempt = 1;
                }
                CEFScene() {
                    this.traceMode = false;
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("CEFScene:Constructor");
                }
                onCreate() {
                    if ((CEFScene.gSceneConfig != null) && (CEFScene.gSceneConfig.scenedata[name].create != undefined))
                        this.parseOBJ(this, CEFScene.gSceneConfig.scenedata[name].create.children(), "create");
                    if (this.onCreateScript != null)
                        this.doCreateAction();
                    if ((CEFScene.gSceneConfig != null) && (CEFScene.gSceneConfig.scenedata[name].demoinit != undefined))
                        this.parseOBJ(this, CEFScene.gSceneConfig.scenedata[name].demoinit.children(), "demoinit");
                }
                doCreateAction() {
                    try {
                        eval(this.onCreateScript);
                    }
                    catch (e) {
                        CUtil_28.CUtil.trace("Error in onCreate script: " + this.onCreateScript);
                    }
                }
                doExitAction() {
                    if (this.onExitScript != null) {
                        try {
                            eval(this.onExitScript);
                        }
                        catch (e) {
                            CUtil_28.CUtil.trace("Error in onExit script: " + this.onExitScript);
                        }
                    }
                }
                initUI() {
                }
                effectHandler(evt) {
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("Effect Event: " + evt);
                    this[evt.prop1](evt.prop2, evt.prop3, evt.prop4, evt.prop5);
                }
                scriptHandler(evt) {
                    var fTest = true;
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("Effect Event: " + evt);
                    if (evt.script.features != undefined) {
                        fTest = CEFRoot_22.CEFRoot.gTutor.testFeatureSet(String(evt.script.features));
                    }
                    if (fTest)
                        this.parseOBJ(this, evt.script.children(), "script");
                }
                logSceneTag() {
                    return { 'scenetag': this.sceneTag, 'attempt': this.sceneAttempt++ };
                }
                initAutomation(_parentScene, scene, ObjIdRef, lLogger, lTutor) {
                    var sceneObj;
                    var wozObj;
                    var wozRoot;
                    this.onCreate();
                    for (var i1 = 0; i1 < this.numChildren; i1++) {
                        sceneObj = this.getChildAt(i1);
                        scene[sceneObj.name] = new Object;
                        scene[sceneObj.name].instance = sceneObj;
                        if (sceneObj instanceof CEFObject_11.CEFObject) {
                            sceneObj.parentScene = _parentScene;
                            sceneObj.measure();
                        }
                        if (this.traceMode)
                            CUtil_28.CUtil.trace("\t\tCEFScene found subObject named:" + sceneObj.name + " ... in-place: ");
                        if (sceneObj instanceof CEFObject_11.CEFObject) {
                            wozObj = sceneObj;
                            wozObj.initAutomation(_parentScene, scene[sceneObj.name], name + ".", lLogger, lTutor);
                        }
                        if (this.traceMode)
                            for (var id in scene[sceneObj.name].inPlace) {
                                CUtil_28.CUtil.trace("\t\t\t\t" + id + " : " + scene[sceneObj.name].inPlace[id]);
                            }
                    }
                }
                captureDefState(TutScene) {
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("\t*** Start Capture - Walking Top Level Objects***");
                    for (var sceneObj in TutScene) {
                        if (sceneObj != "instance" && TutScene[sceneObj].instance instanceof CEFObject_11.CEFObject) {
                            if (this.traceMode)
                                CUtil_28.CUtil.trace("capturing: " + TutScene[sceneObj].instance.name);
                            TutScene[sceneObj].instance.captureDefState(TutScene[sceneObj]);
                        }
                    }
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("\t*** End Capture - Walking Top Level Objects***");
                }
                restoreDefState(TutScene) {
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("\t*** Start Restore - Walking Top Level Objects***");
                    for (var sceneObj in TutScene) {
                        if (sceneObj != "instance" && TutScene[sceneObj].instance instanceof CEFObject_11.CEFObject) {
                            if (this.traceMode)
                                CUtil_28.CUtil.trace("restoring: " + TutScene[sceneObj].instance.name);
                            TutScene[sceneObj].instance.restoreDefState(TutScene[sceneObj]);
                        }
                    }
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("\t*** End Restore - Walking Top Level Objects***");
                }
                setObjMode(TutScene, sMode) {
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("\t*** Start - Walking Top Level Objects***");
                    for (var sceneObj in TutScene) {
                        if (sceneObj != "instance" && TutScene[sceneObj].instance instanceof CEFObject_11.CEFObject) {
                            TutScene[sceneObj].instance.setAutomationMode(TutScene[sceneObj], sMode);
                        }
                    }
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("\t*** End - Walking Top Level Objects***");
                }
                dumpSceneObjs(TutScene) {
                    for (var sceneObj in TutScene) {
                        if (this.traceMode)
                            CUtil_28.CUtil.trace("\tSceneObj : " + sceneObj);
                        if (sceneObj != "instance" && TutScene[sceneObj].instance instanceof CEFObject_11.CEFObject) {
                            if (this.traceMode)
                                CUtil_28.CUtil.trace("\tCEF***");
                            TutScene[sceneObj].instance.dumpSubObjs(TutScene[sceneObj], "\t");
                        }
                    }
                }
                updateNav() {
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("UpdateNavigation: ", name, this.fComplete);
                    if (!this.fComplete)
                        CEFRoot_22.CEFRoot.gTutor.enableNext(false);
                    else
                        CEFRoot_22.CEFRoot.gTutor.enableNext(true);
                    if (this.gForceBackButton)
                        CEFRoot_22.CEFRoot.gTutor.enableBack(CEFRoot_22.CEFRoot.fEnableBack);
                }
                questionFinished(evt) {
                    this.fComplete = true;
                    this.updateNav();
                }
                questionComplete() {
                    return this.fComplete;
                }
                preEnterScene(lTutor, sceneLabel, sceneTitle, scenePage, Direction) {
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("Default Pre-Enter Scene Behavior: " + sceneTitle);
                    lTutor.StitleBar.Stitle.text = sceneTitle;
                    lTutor.StitleBar.Spage.text = scenePage;
                    this.demoBehavior();
                    if ((CEFScene.gSceneConfig != null) && (CEFScene.gSceneConfig.scenedata[name].preenter != undefined))
                        this.parseOBJ(this, CEFScene.gSceneConfig.scenedata[name].preenter.children(), "preenter");
                    if (this.fComplete)
                        this.updateNav();
                    this.initUI();
                    return sceneLabel;
                }
                deferredEnterScene(Direction) {
                }
                onEnterScene(Direction) {
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("Default Enter Scene Behavior:");
                    if ((CEFScene.gSceneConfig != null) && (CEFScene.gSceneConfig.scenedata[name].onenter != undefined))
                        this.parseOBJ(this, CEFScene.gSceneConfig.scenedata[name].onenter.children(), "onenter");
                }
                preExitScene(Direction, sceneCurr) {
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("Default Pre-Exit Scene Behavior:");
                    if ((CEFScene.gSceneConfig != null) && (CEFScene.gSceneConfig.scenedata[name].preexit != undefined))
                        this.parseOBJ(this, CEFScene.gSceneConfig.scenedata[name].preexit.children(), "preexit");
                    return (CEFObject_11.CEFObject.OKNAV);
                }
                onExitScene() {
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("Default Exit Scene Behavior:");
                    if ((CEFScene.gSceneConfig != null) && (CEFScene.gSceneConfig.scenedata[name].onexit != undefined))
                        this.parseOBJ(this, CEFScene.gSceneConfig.scenedata[name].onexit.children(), "onexit");
                }
                demoBehavior() {
                    if (this.traceMode)
                        CUtil_28.CUtil.trace("Default demoBehavior: ");
                }
                initSeekArrays() {
                }
                doSeekForward(evt) {
                    switch (evt.wozSeekSeq) {
                    }
                }
                doSeekBackward(evt) {
                }
            };
            exports_62("CEFScene", CEFScene);
        }
    };
});
System.register("core/CEFRoot", ["util/CUtil"], function (exports_63, context_63) {
    "use strict";
    var __moduleName = context_63 && context_63.id;
    var CUtil_29, MovieClip, TutorEngineOne, CEFRoot;
    return {
        setters: [
            function (CUtil_29_1) {
                CUtil_29 = CUtil_29_1;
            }
        ],
        execute: function () {
            MovieClip = createjs.MovieClip;
            CEFRoot = class CEFRoot extends MovieClip {
                constructor() {
                    super();
                    this._listenerArr = new Array;
                    this.traceMode = false;
                    if (this.traceMode)
                        CUtil_29.CUtil.trace("CEFRoot:Constructor");
                    this.wozName = "CEF" + CEFRoot._wozInstance.toString();
                    CEFRoot._wozInstance++;
                }
                Destructor() {
                    if (this.traceMode)
                        CUtil_29.CUtil.trace("CEFRoot Destructor:");
                    let subObj;
                    for (let i1 = 0; i1 < this.numChildren; i1++) {
                        subObj = this.getChildAt(i1);
                        if (subObj instanceof CEFRoot) {
                            subObj.Destructor();
                        }
                    }
                }
                captureXMLStructure(parentXML, iDepth) {
                    let element;
                    let elementOBJ = {};
                    let elClass;
                    let elwozname;
                    for (let i1 = 0; i1 < this.numChildren; i1++) {
                        element = this.getChildAt(i1);
                        if (this.traceMode)
                            CUtil_29.CUtil.trace("\t\tCEFScene found subObject named:" + element.name + " ... in-place: ");
                        if (element instanceof CEFRoot) {
                            elwozname = element.wozName;
                        }
                        else {
                            elwozname = "null";
                        }
                        elementOBJ = new String("<obj " + " class=\"" + elClass + "\" name=\"" + element.name + "\" x=\"" + element.x + "\" y=\"" + element.y + "\" w=\"" + element.width + "\" h=\"" + element.height + "\" r=\"" + element.rotation + "\" a=\"" + element.alpha + "\"/>");
                        if ((iDepth < 1) && (element instanceof CEFRoot))
                            element.captureXMLStructure(elementOBJ, iDepth + 1);
                    }
                }
                resetXML() {
                }
                loadXML(propVector) {
                }
                saveXML() {
                    let stateVector;
                    return stateVector;
                }
                getSymbolClone(_cloneOf, _named) {
                    let xClone = "";
                    CUtil_29.CUtil.trace(xClone);
                    return xClone;
                }
                get gData() {
                    return CEFRoot.SceneData;
                }
                set gData(dataXML) {
                    CEFRoot.SceneData = dataXML;
                }
                get gPhase() {
                    return CEFRoot.fTutorPart;
                }
                set gPhase(phase) {
                    CEFRoot.fTutorPart = phase;
                }
                get gLogR() {
                    return CEFRoot.logR;
                }
                set gLogR(logr) {
                    if (this.traceMode)
                        CUtil_29.CUtil.trace("Connecting Logger: ");
                    CEFRoot.logR = logr;
                }
                resetSceneDataXML() {
                }
                get gForceBackButton() {
                    return CEFRoot.fForceBackButton;
                }
                set gForceBackButton(fForce) {
                    CEFRoot.fForceBackButton = fForce;
                }
                get gNavigator() {
                    return CEFRoot._gNavigator;
                }
                set gNavigator(navObject) {
                    CEFRoot._gNavigator = navObject;
                }
                logState() {
                    return "<null/>";
                }
                IsUserDefined() {
                    let iResult = 0;
                    return iResult;
                }
                get captureLOGString() {
                    return "";
                }
                captureLOGState() {
                    return "<null />";
                }
                isDefined(prop) {
                    let fResult;
                    try {
                        if (this.hasOwnProperty(prop)) {
                            fResult = true;
                        }
                    }
                    catch (err) {
                        if (this.traceMode)
                            CUtil_29.CUtil.trace(prop + " is Undefined");
                        fResult = false;
                    }
                    return fResult;
                }
                superPlay() {
                    if (this.traceMode)
                        CUtil_29.CUtil.trace(name + " Super Play");
                    if (name == "SgenericPrompt")
                        CUtil_29.CUtil.trace("SgenericPrompt Play Found in superPlay");
                    super.play();
                }
                superStop() {
                    if (this.traceMode)
                        CUtil_29.CUtil.trace(name + " Super Stop");
                    super.stop();
                }
                gotoAndStop(frame, scene = null) {
                    if (this.traceMode)
                        CUtil_29.CUtil.trace(name + " is stopped at : " + frame + ":" + scene);
                    if (CEFRoot.gTutor)
                        CEFRoot.gTutor.playRemoveThis(this);
                    super.gotoAndStop(frame + ":" + scene);
                }
                stop() {
                    if (this.traceMode)
                        CUtil_29.CUtil.trace(name + " is stopped");
                    if (CEFRoot.gTutor)
                        CEFRoot.gTutor.playRemoveThis(this);
                    super.stop();
                }
                gotoAndPlay(frame, scene = null) {
                    if (this.traceMode)
                        CUtil_29.CUtil.trace(name + " is playing at : " + frame + ":" + scene);
                    if (name == "SgenericPrompt")
                        CUtil_29.CUtil.trace("SgenericPrompt Play Found in gotoAndPlay");
                    if (CEFRoot.gTutor)
                        CEFRoot.gTutor.playAddThis(this);
                    super.gotoAndPlay(frame + ":" + scene);
                }
                play() {
                    if (this.traceMode)
                        CUtil_29.CUtil.trace(name + " is playing");
                    if (name == "SgenericPrompt")
                        CUtil_29.CUtil.trace("SgenericPrompt Play Found in Play");
                    if (CEFRoot.gTutor)
                        CEFRoot.gTutor.playAddThis(this);
                    super.play();
                }
                bindPlay(tutor) {
                    if (this.traceMode)
                        CUtil_29.CUtil.trace(name + " is playing");
                    if (name == "SgenericPrompt")
                        CUtil_29.CUtil.trace("SgenericPrompt Play Found in BindPlay");
                    if (CEFRoot.gTutor)
                        CEFRoot.gTutor.playAddThis(this);
                    super.play();
                }
                setTopMost() {
                    let topPosition;
                    try {
                        if (CEFRoot.gTutor) {
                            topPosition = CEFRoot.gTutor.numChildren - 1;
                            CEFRoot.gTutor.setChildIndex(this, topPosition);
                        }
                    }
                    catch (err) {
                    }
                }
                startSession() {
                    CEFRoot.fSessionTime = CUtil_29.CUtil.getTimer();
                }
                get sessionTime() {
                    let curTime;
                    curTime = (CUtil_29.CUtil.getTimer() - CEFRoot.fSessionTime) / 1000.0;
                    return curTime.toString();
                }
                static instantiateObject(objectClass) {
                    let tarObject;
                    let ClassRef = this.getDefinitionByName(objectClass);
                    tarObject = new ClassRef;
                    return tarObject;
                }
                static getDefinitionByName(className) {
                    let classConstructor;
                    classConstructor = TutorEngineOne.efLibrary[className];
                    return classConstructor;
                }
                dumpStage(_obj, _path) {
                    let sceneObj;
                    for (let i1 = 0; i1 < _obj.numChildren; i1++) {
                        sceneObj = _obj.getChildAt(i1);
                        if (sceneObj) {
                            CUtil_29.CUtil.trace(_path + "." + sceneObj["name"] + " visible : " + ((sceneObj.visible) ? " true" : " false"));
                            if (sceneObj)
                                this.dumpStage(sceneObj, _path + "." + sceneObj["name"]);
                        }
                    }
                }
            };
            CEFRoot.STAGEWIDTH = 1024;
            CEFRoot.STAGEHEIGHT = 768;
            CEFRoot.fRemoteMode = false;
            CEFRoot.fDemo = true;
            CEFRoot.fDebug = true;
            CEFRoot.fLog = false;
            CEFRoot.fDeferDemoClick = true;
            CEFRoot.fTutorPart = "Intro & Ramp Pre-test";
            CEFRoot.fFullSignIn = false;
            CEFRoot.fSkipAssess = false;
            CEFRoot.fEnableBack = true;
            CEFRoot.fForceBackButton = true;
            CEFRoot.fSkillometer = false;
            CEFRoot.sessionAccount = new Object();
            CEFRoot.serverUserID = 0;
            CEFRoot.fPlaybackMode = false;
            CEFRoot.WOZREPLAY = "rootreplay";
            CEFRoot.WOZCANCEL = "rootcancel";
            CEFRoot.WOZPAUSING = "rootpause";
            CEFRoot.WOZPLAYING = "rootplay";
            CEFRoot.SceneData = "<data/>";
            CEFRoot._wozInstance = 1;
            exports_63("CEFRoot", CEFRoot);
        }
    };
});
System.register("core/CEFMouseMask", ["core/CEFObject", "events/CEFMouseEvent", "util/CUtil"], function (exports_64, context_64) {
    "use strict";
    var __moduleName = context_64 && context_64.id;
    var CEFObject_12, CEFMouseEvent_7, CUtil_30, CEFMouseMask;
    return {
        setters: [
            function (CEFObject_12_1) {
                CEFObject_12 = CEFObject_12_1;
            },
            function (CEFMouseEvent_7_1) {
                CEFMouseEvent_7 = CEFMouseEvent_7_1;
            },
            function (CUtil_30_1) {
                CUtil_30 = CUtil_30_1;
            }
        ],
        execute: function () {
            CEFMouseMask = class CEFMouseMask extends CEFObject_12.CEFObject {
                constructor() {
                    super();
                    this.traceMode = false;
                    this.addEventListener(CEFMouseEvent_7.CEFMouseEvent.WOZCLICKED, this.discardEvent);
                    this.addEventListener(CEFMouseEvent_7.CEFMouseEvent.WOZMOVE, this.discardEvent);
                    this.addEventListener(CEFMouseEvent_7.CEFMouseEvent.WOZOVER, this.discardEvent);
                    this.addEventListener(CEFMouseEvent_7.CEFMouseEvent.WOZOUT, this.discardEvent);
                    this.addEventListener(CEFMouseEvent_7.CEFMouseEvent.WOZDOWN, this.discardEvent);
                    this.addEventListener(CEFMouseEvent_7.CEFMouseEvent.WOZUP, this.discardEvent);
                }
                discardEvent(evt) {
                    if (this.traceMode)
                        CUtil_30.CUtil.trace("Attempting to stop Propogation", evt.target, evt.type);
                    evt.stopPropagation();
                }
                setObjMode(dlgPanel, sMode) {
                    if (this.traceMode)
                        CUtil_30.CUtil.trace("\t*** Start - Walking Dialog Objects***");
                    for (var dialogObj in dlgPanel) {
                        if (dialogObj != "instance" && dlgPanel[dialogObj].instance instanceof CEFObject_12.CEFObject) {
                            dlgPanel[dialogObj].instance.setAutomationMode(dlgPanel[dialogObj], sMode);
                        }
                    }
                    if (this.traceMode)
                        CUtil_30.CUtil.trace("\t*** End - Walking Dialog Objects***");
                }
                dumpSceneObjs(dlgPanel) {
                    for (var dialogObj in dlgPanel) {
                        if (this.traceMode)
                            CUtil_30.CUtil.trace("\tNavPanelObj : " + dialogObj);
                        if (dialogObj != "instance" && dlgPanel[dialogObj].instance instanceof CEFObject_12.CEFObject) {
                            if (this.traceMode)
                                CUtil_30.CUtil.trace("\tCEF***");
                            dlgPanel[dialogObj].instance.dumpSubObjs(dlgPanel[dialogObj], "\t");
                        }
                    }
                }
            };
            exports_64("CEFMouseMask", CEFMouseMask);
        }
    };
});
System.register("scenes/CEFNavDemo", ["core/CEFRoot", "core/CEFDoc", "core/CEFSceneSequence", "events/CEFNavEvent", "util/CUtil"], function (exports_65, context_65) {
    "use strict";
    var __moduleName = context_65 && context_65.id;
    var CEFRoot_23, CEFDoc_4, CEFSceneSequence_3, CEFNavEvent_4, CUtil_31, CEFNavDemo;
    return {
        setters: [
            function (CEFRoot_23_1) {
                CEFRoot_23 = CEFRoot_23_1;
            },
            function (CEFDoc_4_1) {
                CEFDoc_4 = CEFDoc_4_1;
            },
            function (CEFSceneSequence_3_1) {
                CEFSceneSequence_3 = CEFSceneSequence_3_1;
            },
            function (CEFNavEvent_4_1) {
                CEFNavEvent_4 = CEFNavEvent_4_1;
            },
            function (CUtil_31_1) {
                CUtil_31 = CUtil_31_1;
            }
        ],
        execute: function () {
            CEFNavDemo = class CEFNavDemo extends CEFSceneSequence_3.CEFSceneSequence {
                constructor() {
                    super();
                    this._scenesShown = false;
                    if (this.traceMode)
                        CUtil_31.CUtil.trace("CEFNavDemo:Constructor");
                    this._demoPanel = CEFRoot_23.CEFRoot.instantiateObject("CDemoPanel");
                    this._demoPanel.x = 0;
                    this._demoPanel.y = 0;
                    this._demoPanel.alpha = 1.0;
                    this._demoPanel.visible = true;
                    this._demoPanel.name = "SdemoPanel";
                    this._demoPanel["demoPath"] = CEFDoc_4.CEFDoc.gApp["_modulePath"];
                    this.addChild(this._demoPanel);
                    this._demoPanel.addEventListener(CEFNavEvent_4.CEFNavEvent.WOZNAVTO, this.gotoScene);
                    CEFRoot_23.CEFRoot.gTutor.automateScene("SdemoScene", this);
                }
                gotoScene(evt) {
                    var features;
                    var featVect = new Array();
                    var subFeature;
                    if (evt.wozFeatures != null)
                        CEFRoot_23.CEFRoot.gTutor.setTutorFeatures(evt.wozFeatures);
                    if (!this._scenesShown) {
                        CEFRoot_23.CEFRoot.gTutor.SnavPanel.visible = true;
                        CEFRoot_23.CEFRoot.gTutor.StitleBar.visible = true;
                        this._scenesShown = true;
                    }
                    CEFRoot_23.CEFRoot.gTutor.xitions.resetTransitions();
                    CEFRoot_23.CEFRoot.gTutor.goToScene(new CEFNavEvent_4.CEFNavEvent(CEFNavEvent_4.CEFNavEvent.WOZNAVTO, evt.wozNavTarget));
                }
            };
            exports_65("CEFNavDemo", CEFNavDemo);
        }
    };
});
System.register("events/CEFDialogEvent", [], function (exports_66, context_66) {
    "use strict";
    var __moduleName = context_66 && context_66.id;
    var Event, CEFDialogEvent;
    return {
        setters: [],
        execute: function () {
            Event = createjs.Event;
            CEFDialogEvent = class CEFDialogEvent extends Event {
                constructor(Result, type, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                    this.result = Result;
                }
                clone() {
                    return new CEFDialogEvent(this.result, this.type, this.bubbles, this.cancelable);
                }
            };
            CEFDialogEvent.ENDMODAL = "ENDMODAL";
            CEFDialogEvent.DLGOK = "DialogOK";
            CEFDialogEvent.DLGCANCEL = "DialogCancel";
            exports_66("CEFDialogEvent", CEFDialogEvent);
        }
    };
});
System.register("dialogs/CEFDialogBox", ["core/CEFObject", "core/CEFDoc", "core/CEFMouseMask", "events/CEFDialogEvent", "util/CUtil"], function (exports_67, context_67) {
    "use strict";
    var __moduleName = context_67 && context_67.id;
    var CEFObject_13, CEFDoc_5, CEFMouseMask_1, CEFDialogEvent_1, CUtil_32, CEFDialogBox;
    return {
        setters: [
            function (CEFObject_13_1) {
                CEFObject_13 = CEFObject_13_1;
            },
            function (CEFDoc_5_1) {
                CEFDoc_5 = CEFDoc_5_1;
            },
            function (CEFMouseMask_1_1) {
                CEFMouseMask_1 = CEFMouseMask_1_1;
            },
            function (CEFDialogEvent_1_1) {
                CEFDialogEvent_1 = CEFDialogEvent_1_1;
            },
            function (CUtil_32_1) {
                CUtil_32 = CUtil_32_1;
            }
        ],
        execute: function () {
            CEFDialogBox = class CEFDialogBox extends CEFObject_13.CEFObject {
                CEFDialogBox() {
                }
                setTitle(txt) {
                    this.Stitle.text = txt;
                }
                moveDialog(X, Y) {
                    this.x = X;
                    this.y = Y;
                }
                centerDialog() {
                }
                doModal(accounts = null, Alpha = 1, fAdd = true) {
                    this.fAddDlg = fAdd;
                    if (fAdd) {
                        this.sMask = new CEFMouseMask_1.CEFMouseMask();
                        this.sMask.x = 0;
                        this.sMask.y = 0;
                        this.sMask.alpha = Alpha;
                        this.sMask.visible = true;
                        this.visible = true;
                        if (CEFDoc_5.CEFDoc.gApp && CEFDoc_5.CEFDoc.gApp.Stutor) {
                            CEFDoc_5.CEFDoc.gApp.Stutor.addChild(this.sMask);
                            CEFDoc_5.CEFDoc.gApp.Stutor.addChild(this);
                        }
                    }
                    else {
                        this.sMask.x = 0;
                        this.sMask.y = 0;
                        this.sMask.alpha = Alpha;
                        this.sMask.visible = true;
                        this.visible = true;
                        this.sMask.setTopMost();
                        this.setTopMost();
                    }
                    if (CEFDoc_5.CEFDoc.gApp && CEFDoc_5.CEFDoc.gApp.Stutor && CEFDoc_5.CEFDoc.gApp.Stutor.cCursor)
                        CEFDoc_5.CEFDoc.gApp.Stutor.cCursor.setTopMost();
                }
                endModal(result) {
                    if (this.fAddDlg) {
                        this.visible = false;
                        if (CEFDoc_5.CEFDoc.gApp && CEFDoc_5.CEFDoc.gApp.Stutor) {
                            CEFDoc_5.CEFDoc.gApp.Stutor.removeChild(this.sMask);
                            CEFDoc_5.CEFDoc.gApp.Stutor.removeChild(this);
                        }
                        this.sMask = null;
                    }
                    else {
                        this.visible = false;
                        this.sMask.visible = false;
                    }
                    this.dispatchEvent(new CEFDialogEvent_1.CEFDialogEvent(result, CEFDialogEvent_1.CEFDialogEvent.ENDMODAL));
                }
                setObjMode(dlgPanel, sMode) {
                    if (this.traceMode)
                        CUtil_32.CUtil.trace("\t*** Start - Walking Dialog Objects***");
                    for (let dialogObj in dlgPanel) {
                        if (dialogObj != "instance" && dlgPanel[dialogObj].instance instanceof CEFObject_13.CEFObject) {
                            dlgPanel[dialogObj].instance.setAutomationMode(dlgPanel[dialogObj], sMode);
                        }
                    }
                    if (this.traceMode)
                        CUtil_32.CUtil.trace("\t*** End - Walking Dialog Objects***");
                }
                dumpSceneObjs(dlgPanel) {
                    for (let dialogObj in dlgPanel) {
                        if (this.traceMode)
                            CUtil_32.CUtil.trace("\tNavPanelObj : " + dialogObj);
                        if (dialogObj != "instance" && dlgPanel[dialogObj].instance instanceof CEFObject_13.CEFObject) {
                            if (this.traceMode)
                                CUtil_32.CUtil.trace("\tCEF***");
                            dlgPanel[dialogObj].instance.dumpSubObjs(dlgPanel[dialogObj], "\t");
                        }
                    }
                }
            };
            CEFDialogBox.ENDMODAL = "ENDMODAL";
            exports_67("CEFDialogBox", CEFDialogBox);
        }
    };
});
System.register("controls/CEFLabelButton", ["core/CEFButton"], function (exports_68, context_68) {
    "use strict";
    var __moduleName = context_68 && context_68.id;
    var CEFButton_3, CEFLabelButton;
    return {
        setters: [
            function (CEFButton_3_1) {
                CEFButton_3 = CEFButton_3_1;
            }
        ],
        execute: function () {
            CEFLabelButton = class CEFLabelButton extends CEFButton_3.CEFButton {
                CEFLabelButton() {
                }
                setLabel(newLabel) {
                    this.Sup.Slabel.text = newLabel;
                    this.Sover.Slabel.text = newLabel;
                    this.Sdown.Slabel.text = newLabel;
                    this.Sdisabled.Slabel.text = newLabel;
                }
            };
            exports_68("CEFLabelButton", CEFLabelButton);
        }
    };
});
System.register("dialogs/CDialogDesignPrompt1", ["events/CEFMouseEvent", "dialogs/CEFDialogBox"], function (exports_69, context_69) {
    "use strict";
    var __moduleName = context_69 && context_69.id;
    var CEFMouseEvent_8, CEFDialogBox_1, CDialogDesignPrompt1;
    return {
        setters: [
            function (CEFMouseEvent_8_1) {
                CEFMouseEvent_8 = CEFMouseEvent_8_1;
            },
            function (CEFDialogBox_1_1) {
                CEFDialogBox_1 = CEFDialogBox_1_1;
            }
        ],
        execute: function () {
            CDialogDesignPrompt1 = class CDialogDesignPrompt1 extends CEFDialogBox_1.CEFDialogBox {
                CDialogDesignPrompt1() {
                    this.setTitle("Notice");
                    this.Scancel.setLabel("Cancel");
                }
                Destructor() {
                    this.Scancel.removeEventListener(CEFMouseEvent_8.CEFMouseEvent.WOZCLICK, this.doCancel);
                    super.Destructor();
                }
                doCancel(evt) {
                    this.endModal(CDialogDesignPrompt1.DLGSTAY);
                }
                doModal(accounts = null, Alpha = 1, fAdd = true) {
                    super.doModal(accounts, Alpha, fAdd);
                    this.Scancel.addEventListener(CEFMouseEvent_8.CEFMouseEvent.WOZCLICK, this.doCancel);
                }
                endModal(Result) {
                    super.endModal(Result);
                    this.Scancel.removeEventListener(CEFMouseEvent_8.CEFMouseEvent.WOZCLICK, this.doCancel);
                }
            };
            CDialogDesignPrompt1.DLGSTAY = "DLGStay";
            CDialogDesignPrompt1.DLGNEXT = "DLGNext";
            exports_69("CDialogDesignPrompt1", CDialogDesignPrompt1);
        }
    };
});
System.register("core/CEFTutor", ["core/CEFRoot", "core/CEFTutorRoot", "scenegraph/CSceneGraphNavigator", "util/CUtil"], function (exports_70, context_70) {
    "use strict";
    var __moduleName = context_70 && context_70.id;
    var CEFRoot_24, CEFTutorRoot_2, CSceneGraphNavigator_2, CUtil_33, CEFTutor;
    return {
        setters: [
            function (CEFRoot_24_1) {
                CEFRoot_24 = CEFRoot_24_1;
            },
            function (CEFTutorRoot_2_1) {
                CEFTutorRoot_2 = CEFTutorRoot_2_1;
            },
            function (CSceneGraphNavigator_2_1) {
                CSceneGraphNavigator_2 = CSceneGraphNavigator_2_1;
            },
            function (CUtil_33_1) {
                CUtil_33 = CUtil_33_1;
            }
        ],
        execute: function () {
            CEFTutor = class CEFTutor extends CEFTutorRoot_2.CEFTutorRoot {
                constructor() {
                    super();
                    this.tutorScenes = new Array();
                    this.Ramps_Pre_Title = "";
                    this.designTitle = "Design Ramp Experiments";
                    this.thinkTitle = "Think about designing experiments";
                    this.traceMode = false;
                    CUtil_33.CUtil.trace("CEFTutor:Constructor");
                    this.instantiateKT();
                }
                initializeScenes() {
                    if (CEFRoot_24.CEFRoot.gSceneGraphDesc != null)
                        CSceneGraphNavigator_2.CSceneGraphNavigator.rootGraphFactory(CEFRoot_24.CEFRoot.gSceneGraphDesc);
                    if (this.StitleBar != null)
                        this.StitleBar.configDemoButton(this);
                }
                resetZorder() {
                    if (this.StitleBar != null)
                        this.StitleBar.setTopMost();
                    if (this.Sscene0 != null)
                        this.Sscene0.setTopMost();
                    if (this.SdemoScene != null)
                        this.SdemoScene.setTopMost();
                }
            };
            CEFTutor.CREATE = true;
            CEFTutor.NOCREATE = false;
            CEFTutor.PERSIST = true;
            CEFTutor.NOPERSIST = false;
            CEFTutor.ENQUEUE = true;
            CEFTutor.NOENQUEUE = false;
            exports_70("CEFTutor", CEFTutor);
        }
    };
});
System.register("TutorEngineOne", ["core/CEFRoot", "core/CEFTutor"], function (exports_71, context_71) {
    "use strict";
    var __moduleName = context_71 && context_71.id;
    function start() {
        let efLibrary = new CEFRoot_25.CEFRoot();
        let tutor = new CEFTutor_1.CEFTutor();
        console.log("In TutorEngineOne startup");
    }
    exports_71("start", start);
    var CEFRoot_25, CEFTutor_1;
    return {
        setters: [
            function (CEFRoot_25_1) {
                CEFRoot_25 = CEFRoot_25_1;
            },
            function (CEFTutor_1_1) {
                CEFTutor_1 = CEFTutor_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("controls/CEFLabelControl", ["core/CEFObject"], function (exports_72, context_72) {
    "use strict";
    var __moduleName = context_72 && context_72.id;
    var CEFObject_14, CEFLabelControl;
    return {
        setters: [
            function (CEFObject_14_1) {
                CEFObject_14 = CEFObject_14_1;
            }
        ],
        execute: function () {
            CEFLabelControl = class CEFLabelControl extends CEFObject_14.CEFObject {
                constructor() {
                    super();
                }
                setLabel(newLabel, colour = 0x000000) {
                }
            };
            exports_72("CEFLabelControl", CEFLabelControl);
        }
    };
});
System.register("core/CEFCheckButton", ["core/CEFButton", "core/CEFRoot", "events/CEFMouseEvent", "util/CUtil"], function (exports_73, context_73) {
    "use strict";
    var __moduleName = context_73 && context_73.id;
    var CEFButton_4, CEFRoot_26, CEFMouseEvent_9, CUtil_34, CEFCheckButton;
    return {
        setters: [
            function (CEFButton_4_1) {
                CEFButton_4 = CEFButton_4_1;
            },
            function (CEFRoot_26_1) {
                CEFRoot_26 = CEFRoot_26_1;
            },
            function (CEFMouseEvent_9_1) {
                CEFMouseEvent_9 = CEFMouseEvent_9_1;
            },
            function (CUtil_34_1) {
                CUtil_34 = CUtil_34_1;
            }
        ],
        execute: function () {
            CEFCheckButton = class CEFCheckButton extends CEFButton_4.CEFButton {
                constructor() {
                    super(...arguments);
                    this.fChecked = false;
                    this._ftrChecked = "";
                    this._ftrUnchecked = "";
                }
                CEFCheckButton() {
                    this.traceMode = false;
                    if (this.traceMode)
                        CUtil_34.CUtil.trace("CEFCheckButton:Constructor");
                    this.addEventListener(CEFMouseEvent_9.CEFMouseEvent.WOZCLICK, this.doMouseClick);
                }
                Destructor() {
                    this.removeEventListener(CEFMouseEvent_9.CEFMouseEvent.WOZCLICK, this.doMouseClick);
                    super.Destructor();
                }
                highLight(color) {
                }
                set label(newLabel) {
                }
                get label() {
                    return "";
                }
                setLabel(newLabel) {
                    this.label = newLabel;
                }
                getLabel() {
                    return "";
                }
                set showLabel(bVisible) {
                    this.Slabel.visible = bVisible;
                }
                captureDefState(TutScene) {
                    super.captureDefState(TutScene);
                }
                restoreDefState(TutScene) {
                    this.fChecked = false;
                    super.restoreDefState(TutScene);
                }
                deepStateCopy(src) {
                    this.fChecked = src["fChecked"];
                    this.curState = src["curState"];
                    this._isvalid = src["_isvalid"];
                    this.label = src["Slabel"].label.text;
                    this.Slabel.visible = src["Slabel"].visible;
                    this.gotoState(this.curState);
                    super.deepStateCopy(src);
                }
                captureLogState(obj = null) {
                    obj = super.captureLogState(obj);
                    obj['checked'] = this.fChecked.toString();
                    return obj;
                }
                captureXMLState() {
                    let xmlVal = super.captureXMLState();
                    xmlVal.checked = this.fChecked.toString();
                    return xmlVal;
                }
                resetState() {
                    super.resetState();
                    this["Schecked"].visible = false;
                }
                gotoState(sState) {
                    if (this.traceMode)
                        CUtil_34.CUtil.trace("CEFButton.gotoState: ", name + " " + sState);
                    this.resetState();
                    this.curState = sState;
                    if (!this.fEnabled) {
                        this["Sdisabled"].visible = true;
                        this.fPressed = false;
                    }
                    else
                        switch (sState) {
                            case "Sdown":
                                this["Sdown"].visible = true;
                                this.fPressed = true;
                                break;
                            case "Sup":
                                if (this.fChecked)
                                    this["Schecked"].visible = true;
                                else
                                    this["Sup"].visible = true;
                                this.fPressed = false;
                                break;
                            case "Sover":
                                if (!this.fPressed) {
                                    if (this.fChecked)
                                        this["Schecked"].visible = true;
                                    else
                                        this["Sover"].visible = true;
                                }
                                else
                                    this["Sdown"].visible = true;
                                break;
                            case "Sout":
                                if (this.fChecked)
                                    this["Schecked"].visible = true;
                                else
                                    this["Sup"].visible = true;
                                break;
                        }
                }
                doMouseClick(evt) {
                    this.setCheck(!this.fChecked);
                    if (this.traceMode)
                        CUtil_34.CUtil.trace("Setting Checked State: " + this.fChecked + " on button: " + name);
                }
                setCheck(bCheck) {
                    this.fChecked = bCheck;
                    this.gotoState("Sup");
                }
                getChecked() {
                    return this.fChecked;
                }
                assertFeatures() {
                    if (this.fChecked) {
                        this._activeFeature = this._ftrChecked;
                    }
                    else {
                        this._activeFeature = this._ftrUnchecked;
                    }
                    if (this._activeFeature != "") {
                        CEFRoot_26.CEFRoot.gTutor.addFeature = this._activeFeature;
                    }
                    return this.activeFeature;
                }
                retractFeatures() {
                    if (this._ftrChecked != "") {
                        CEFRoot_26.CEFRoot.gTutor.delFeature = this._ftrChecked;
                    }
                    if (this._ftrUnchecked != "") {
                        CEFRoot_26.CEFRoot.gTutor.delFeature = this._ftrUnchecked;
                    }
                }
                loadXML(xmlSrc) {
                    super.loadXML(xmlSrc);
                    if (xmlSrc.valid != undefined)
                        this._isvalid = xmlSrc.valid;
                    if (xmlSrc.ftrChecked != undefined)
                        this._ftrChecked = xmlSrc.ftrChecked;
                    if (xmlSrc.ftrUnchecked != undefined)
                        this._ftrUnchecked = xmlSrc.ftrUnchecked;
                    if (xmlSrc.checked != undefined)
                        this.setCheck(Boolean(xmlSrc.checked == "true" ? true : false));
                    if (xmlSrc.label != undefined)
                        this.setLabel(xmlSrc.label);
                    if (xmlSrc.showlabel != undefined)
                        this.showLabel = (Boolean(xmlSrc.showlabel == "true" ? true : false));
                }
                saveXML() {
                    let propVector;
                    return propVector;
                }
            };
            exports_73("CEFCheckButton", CEFCheckButton);
        }
    };
});
System.register("events/CEFButtonEvent", [], function (exports_74, context_74) {
    "use strict";
    var __moduleName = context_74 && context_74.id;
    var Event, CEFButtonEvent;
    return {
        setters: [],
        execute: function () {
            Event = createjs.Event;
            CEFButtonEvent = class CEFButtonEvent extends Event {
                constructor(type, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                }
            };
            CEFButtonEvent.WOZCHECKED = "wozchecked";
            CEFButtonEvent.WOZUNCHECKED = "wozunchecked";
            exports_74("CEFButtonEvent", CEFButtonEvent);
        }
    };
});
System.register("core/CEFButtonGroup", ["core/CEFRoot", "core/CEFObject", "events/CEFButtonEvent", "util/CUtil"], function (exports_75, context_75) {
    "use strict";
    var __moduleName = context_75 && context_75.id;
    var CEFRoot_27, CEFObject_15, CEFButtonEvent_1, CUtil_35, CEFButtonGroup;
    return {
        setters: [
            function (CEFRoot_27_1) {
                CEFRoot_27 = CEFRoot_27_1;
            },
            function (CEFObject_15_1) {
                CEFObject_15 = CEFObject_15_1;
            },
            function (CEFButtonEvent_1_1) {
                CEFButtonEvent_1 = CEFButtonEvent_1_1;
            },
            function (CUtil_35_1) {
                CUtil_35 = CUtil_35_1;
            }
        ],
        execute: function () {
            CEFButtonGroup = class CEFButtonGroup extends CEFObject_15.CEFObject {
                constructor() {
                    super();
                    this.buttonType = new Array();
                    this._fRadioGroup = true;
                    this._inited = false;
                    this.onChangeScript = null;
                    this.buttons = new Array();
                }
                addButton(newButton, bType = "") {
                    this.buttons.push(newButton);
                    this.buttonType.push(bType);
                    newButton.addEventListener(CEFButtonEvent_1.CEFButtonEvent.WOZCHECKED, this.updateGroupChk);
                    newButton.addEventListener(CEFButtonEvent_1.CEFButtonEvent.WOZUNCHECKED, this.updateGroupUnChk);
                }
                removeButton(newButton) {
                    newButton.removeEventListener(CEFButtonEvent_1.CEFButtonEvent.WOZCHECKED, this.updateGroupChk);
                    newButton.removeEventListener(CEFButtonEvent_1.CEFButtonEvent.WOZUNCHECKED, this.updateGroupUnChk);
                }
                updateGroupChk(evt) {
                    let i1;
                    let _radioReset = false;
                    dispatchEvent(new Event(CEFButtonGroup.CHECKED));
                    for (i1 = 0; i1 < this.buttons.length; i1++) {
                        if (this.buttons[i1] == evt.target) {
                            if (this.buttonType[i1] == "radio")
                                _radioReset = true;
                        }
                    }
                    if (this._fRadioGroup || _radioReset) {
                        for (i1 = 0; i1 < this.buttons.length; i1++) {
                            if (this.buttons[i1] != evt.target) {
                                this.buttons[i1].setCheck(false);
                            }
                        }
                    }
                    else {
                        for (i1 = 0; i1 < this.buttons.length; i1++) {
                            if ((this.buttons[i1] != evt.target) && (this.buttonType[i1] == "radio")) {
                                this.buttons[i1].setCheck(false);
                            }
                        }
                    }
                    if (this.onChangeScript != null)
                        this.doChangeAction(evt);
                }
                updateGroupUnChk(evt) {
                    this.dispatchEvent(new Event(CEFButtonEvent_1.CEFButtonEvent.WOZCHECKED));
                    if (this.onChangeScript != null)
                        this.doChangeAction(evt);
                }
                doChangeAction(evt) {
                    try {
                        eval(this.onChangeScript);
                    }
                    catch (e) {
                        CUtil_35.CUtil.trace("Error in onChange script: " + this.onChangeScript);
                    }
                }
                set radioType(fRadioGroup) {
                    this._fRadioGroup = fRadioGroup;
                }
                get isComplete() {
                    let sResult = "false";
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        if (this.buttons[i1].getChecked()) {
                            sResult = "true";
                            break;
                        }
                    }
                    return sResult;
                }
                querySelectedValid() {
                    let sResult = "true";
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        if (this.buttons[i1].getChecked()) {
                            if (this.buttons[i1].isValid == "false") {
                                sResult = "false";
                                break;
                            }
                        }
                        else {
                            if (this.buttons[i1].isValid == "true") {
                                sResult = "false";
                                break;
                            }
                        }
                    }
                    return sResult;
                }
                resetAll() {
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        this.buttons[i1].resetState();
                    }
                }
                highLightRightOnly() {
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        if (this.buttons[i1].isValid == "true")
                            this.buttons[i1].setCheck2(true);
                        else
                            this.buttons[i1].resetState();
                    }
                }
                highLightRightLabel(hColor) {
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        if (this.buttons[i1].isValid == "true")
                            this.buttons[i1].highLight(hColor);
                    }
                }
                highLightWrong() {
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        if (this.buttons[i1].getChecked()) {
                            if (this.buttons[i1].isValid != "true") {
                                this.buttons[i1].setCheck3(true);
                            }
                        }
                    }
                }
                get isValid() {
                    let sResult = "true";
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        if (this.buttons[i1].getChecked() == true) {
                            if (this.buttons[i1].isValid != "true") {
                                sResult = "false";
                                break;
                            }
                        }
                        else {
                            if (this.buttons[i1].isValid == "true") {
                                sResult = "false";
                                break;
                            }
                        }
                    }
                    return sResult;
                }
                assertFeatures() {
                    let _feature;
                    if (this.isValid == "true") {
                        _feature = this._validFeature;
                    }
                    else {
                        _feature = this._invalidFeature;
                    }
                    if (_feature != "")
                        CEFRoot_27.CEFRoot.gTutor.addFeature = _feature;
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        this.buttons[i1].assertFeatures();
                    }
                    return _feature;
                }
                retractFeatures() {
                    let _feature;
                    if (this.isValid == "true") {
                        _feature = this._validFeature;
                    }
                    else {
                        _feature = this._invalidFeature;
                    }
                    if (_feature != "")
                        CEFRoot_27.CEFRoot.gTutor.delFeature = _feature;
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        this.buttons[i1].retractFeatures();
                    }
                }
                get tallyValid() {
                    let iResult = 0;
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        if (this.buttons[i1].getChecked() == true) {
                            if (this.buttons[i1].isValid != "true") {
                                iResult = 0;
                                break;
                            }
                            else
                                iResult++;
                        }
                    }
                    return iResult.toString();
                }
                get tallySelected() {
                    let iResult = 0;
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        if (this.buttons[i1].getChecked() == true) {
                            iResult++;
                        }
                    }
                    return iResult.toString();
                }
                get ansText() {
                    let sResult = "";
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        if (this.buttons[i1].getChecked()) {
                            if (sResult.length > 0)
                                sResult += ",";
                            sResult += this.buttons[i1].getLabel();
                        }
                    }
                    return sResult;
                }
                get inUse() {
                    return this._inited;
                }
                logState() {
                    let groupState;
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        if (this.buttons[i1].getChecked()) {
                            break;
                        }
                    }
                    return groupState;
                }
                querylogGroup() {
                    let groupState = "";
                    for (let i1 = 0; i1 < this.buttons.length; i1++) {
                        if (i1 > 0)
                            groupState += ",";
                        if (this.buttons[i1].getChecked())
                            groupState += "B" + i1 + "_Checked";
                        else
                            groupState += "B" + i1 + "_Unchecked";
                    }
                    return groupState;
                }
                loadXML(xmlSrc) {
                    let tarButton;
                    let objArray;
                    super.loadXML(xmlSrc);
                    for (let butInst of xmlSrc.button) {
                        CUtil_35.CUtil.trace(butInst.name);
                        try {
                            objArray = butInst.name.split(".");
                            if (this.traceMode)
                                CUtil_35.CUtil.trace("Target Array: " + objArray[0]);
                            if (objArray.length)
                                tarButton = this.decodeTarget(this.parent, objArray);
                        }
                        catch (err) {
                            tarButton = null;
                        }
                        if (tarButton) {
                            if (butInst.type != undefined)
                                this.addButton(tarButton, butInst.type);
                            else
                                this.addButton(tarButton);
                        }
                    }
                    if (xmlSrc.wozname != undefined)
                        this.wozName = xmlSrc.wozname;
                    if (xmlSrc.radioType != undefined)
                        this.radioType = (Boolean(xmlSrc.radioType == "true" ? true : false));
                    if (xmlSrc.validftr != undefined)
                        this._validFeature = xmlSrc.validftr;
                    if (xmlSrc.invalidftr != undefined)
                        this._invalidFeature = xmlSrc.invalidftr;
                    if (xmlSrc.onchange != undefined) {
                        this.onChangeScript = xmlSrc.onchange;
                    }
                    this._inited = true;
                }
                saveXML() {
                    let propVector;
                    return propVector;
                }
            };
            CEFButtonGroup.CHECKED = "ischecked";
            exports_75("CEFButtonGroup", CEFButtonGroup);
        }
    };
});
System.register("core/CEFRadioButton", ["events/CEFButtonEvent", "core/CEFCheckButton", "util/CUtil"], function (exports_76, context_76) {
    "use strict";
    var __moduleName = context_76 && context_76.id;
    var CEFButtonEvent_2, CEFCheckButton_1, CUtil_36, CEFRadioButton;
    return {
        setters: [
            function (CEFButtonEvent_2_1) {
                CEFButtonEvent_2 = CEFButtonEvent_2_1;
            },
            function (CEFCheckButton_1_1) {
                CEFCheckButton_1 = CEFCheckButton_1_1;
            },
            function (CUtil_36_1) {
                CUtil_36 = CUtil_36_1;
            }
        ],
        execute: function () {
            CEFRadioButton = class CEFRadioButton extends CEFCheckButton_1.CEFCheckButton {
                constructor() {
                    super();
                }
                attachGroup(butGroup) {
                    butGroup.addButton(this);
                }
                doMouseClick(evt) {
                    this.setCheck(true);
                    if (this.traceMode)
                        CUtil_36.CUtil.trace("Setting Checked State: " + this.fChecked + " on button: " + name);
                }
                setCheck(bCheck) {
                    super.setCheck(bCheck);
                    if (this.fChecked)
                        this.dispatchEvent(new CEFButtonEvent_2.CEFButtonEvent(CEFButtonEvent_2.CEFButtonEvent.WOZCHECKED));
                    else
                        this.dispatchEvent(new CEFButtonEvent_2.CEFButtonEvent(CEFButtonEvent_2.CEFButtonEvent.WOZUNCHECKED));
                }
                toString() {
                    return this.getLabel();
                }
            };
            exports_76("CEFRadioButton", CEFRadioButton);
        }
    };
});
System.register("core/CEFCheckBox", ["core/CEFRadioButton", "events/CEFEvent", "util/CUtil"], function (exports_77, context_77) {
    "use strict";
    var __moduleName = context_77 && context_77.id;
    var CEFRadioButton_1, CEFEvent_10, CUtil_37, CEFCheckBox;
    return {
        setters: [
            function (CEFRadioButton_1_1) {
                CEFRadioButton_1 = CEFRadioButton_1_1;
            },
            function (CEFEvent_10_1) {
                CEFEvent_10 = CEFEvent_10_1;
            },
            function (CUtil_37_1) {
                CUtil_37 = CUtil_37_1;
            }
        ],
        execute: function () {
            CEFCheckBox = class CEFCheckBox extends CEFRadioButton_1.CEFRadioButton {
                constructor() {
                    super();
                }
                doMouseClick(evt) {
                    this.setCheck(!this.fChecked);
                    if (this.traceMode)
                        CUtil_37.CUtil.trace("Setting Checked State: " + this.fChecked + " on button: " + name);
                }
                setCheck(bCheck) {
                    super.setCheck(bCheck);
                    this.dispatchEvent(new Event(CEFEvent_10.CEFEvent.CHANGE));
                }
                setCheck2(bCheck) {
                    this.resetState();
                    this["Scheck2"].visible = bCheck;
                }
                setCheck3(bCheck) {
                    this.resetState();
                    this["Scheck3"].visible = bCheck;
                }
                resetState() {
                    super.resetState();
                    this["Scheck2"].visible = false;
                    this["Scheck3"].visible = false;
                }
                deepStateCopy(src) {
                    this.fChecked = src["fChecked"];
                    this.curState = src["curState"];
                    this._isvalid = src["_isvalid"];
                    this["Schecked"].visible = src["Schecked"].visible;
                    this["Scheck2"].visible = src["Scheck2"].visible;
                    this["Scheck3"].visible = src["Scheck3"].visible;
                    this.label = src["Slabel"].label.text;
                }
            };
            exports_77("CEFCheckBox", CEFCheckBox);
        }
    };
});
System.register("core/CEFSceneNavigator", ["core/CEFNavigator", "core/CEFRoot"], function (exports_78, context_78) {
    "use strict";
    var __moduleName = context_78 && context_78.id;
    var CEFNavigator_3, CEFRoot_28, CEFSceneNavigator;
    return {
        setters: [
            function (CEFNavigator_3_1) {
                CEFNavigator_3 = CEFNavigator_3_1;
            },
            function (CEFRoot_28_1) {
                CEFRoot_28 = CEFRoot_28_1;
            }
        ],
        execute: function () {
            CEFSceneNavigator = class CEFSceneNavigator extends CEFNavigator_3.CEFNavigator {
                constructor() {
                    super();
                    this.StsceneTitle = new Array();
                    this.StscenePage = new Array();
                    this.StsceneSeq = new Array();
                    this.StsceneClass = new Array();
                    this.StscenePersist = new Array();
                    this.StsceneFeatures = new Array();
                }
                addScene(SceneTitle, ScenePage, SceneName, SceneClass, ScenePersist, SceneFeatures = "null") {
                    this.sceneCnt++;
                    this.StsceneTitle.push(SceneTitle);
                    this.StscenePage.push(ScenePage);
                    this.StsceneSeq.push(SceneName);
                    this.StsceneClass.push(SceneClass);
                    this.StscenePersist.push(ScenePersist.toString());
                    if (SceneFeatures != "null")
                        this.StsceneFeatures.push(SceneFeatures);
                    else
                        this.StsceneFeatures.push(null);
                }
                get scenePrev() {
                    return this.StscenePrev;
                }
                set scenePrev(scenePrevINT) {
                    this.StscenePrev = scenePrevINT;
                }
                get sceneCurr() {
                    return this.StsceneCurr;
                }
                set sceneCurr(sceneCurrINT) {
                    this.StsceneCurr = sceneCurrINT;
                }
                get sceneCurrINC() {
                    let feature;
                    let match = false;
                    this.StsceneCurr++;
                    while (this.StsceneFeatures[this.StsceneCurr] != null) {
                        if (!CEFRoot_28.CEFRoot.gTutor.testFeatureSet(this.StsceneFeatures[this.StsceneCurr]))
                            this.StsceneCurr++;
                        else
                            break;
                    }
                    return this.StsceneCurr;
                }
                get sceneCurrDEC() {
                    let feature;
                    let match = false;
                    this.StsceneCurr--;
                    while (this.StsceneFeatures[this.StsceneCurr] != null) {
                        if (!CEFRoot_28.CEFRoot.gTutor.testFeatureSet(this.StsceneFeatures[this.StsceneCurr]))
                            this.StsceneCurr++;
                        else
                            break;
                    }
                    return this.StsceneCurr;
                }
                get sceneTitle() {
                    return this.StsceneTitle;
                }
                set sceneTitle(sceneTitleARRAY) {
                    this.StsceneTitle = sceneTitleARRAY;
                }
                get sceneSeq() {
                    return this.StsceneSeq;
                }
                set sceneSeq(sceneSeqARRAY) {
                    this.StsceneSeq = sceneSeqARRAY;
                }
                get scenePage() {
                    return this.StscenePage;
                }
                set scenePage(scenePageARRAY) {
                    this.StscenePage = scenePageARRAY;
                }
                get sceneName() {
                    return this.StsceneSeq;
                }
                set sceneName(scenePageARRAY) {
                    this.StsceneSeq = scenePageARRAY;
                }
                get sceneClass() {
                    return this.StsceneClass;
                }
                set sceneClass(scenePageARRAY) {
                    this.StsceneClass = scenePageARRAY;
                }
                get scenePersist() {
                    return this.StscenePersist;
                }
                set scenePersist(scenePageARRAY) {
                    this.StscenePersist = scenePageARRAY;
                }
            };
            exports_78("CEFSceneNavigator", CEFSceneNavigator);
        }
    };
});
System.register("core/CEFTutorDoc", ["core/CEFRoot", "core/CEFDoc", "core/CEFObject", "core/CEFCursorProxy", "events/CEFEvent", "util/CUtil"], function (exports_79, context_79) {
    "use strict";
    var __moduleName = context_79 && context_79.id;
    var CEFRoot_29, CEFDoc_6, CEFObject_16, CEFCursorProxy_2, CEFEvent_11, CUtil_38, CEFTutorDoc;
    return {
        setters: [
            function (CEFRoot_29_1) {
                CEFRoot_29 = CEFRoot_29_1;
            },
            function (CEFDoc_6_1) {
                CEFDoc_6 = CEFDoc_6_1;
            },
            function (CEFObject_16_1) {
                CEFObject_16 = CEFObject_16_1;
            },
            function (CEFCursorProxy_2_1) {
                CEFCursorProxy_2 = CEFCursorProxy_2_1;
            },
            function (CEFEvent_11_1) {
                CEFEvent_11 = CEFEvent_11_1;
            },
            function (CUtil_38_1) {
                CUtil_38 = CUtil_38_1;
            }
        ],
        execute: function () {
            CEFTutorDoc = class CEFTutorDoc extends CEFDoc_6.CEFDoc {
                constructor() {
                    super();
                    this._extLoader = false;
                    this._extConnection = false;
                    this._tutorFeatures = "FTR_PRETEST:FTR_TYPEA";
                    this._forcedPause = false;
                    CUtil_38.CUtil.trace("CWOZTutorDoc:Constructor");
                    addEventListener(CEFEvent_11.CEFEvent.ADDED_TO_STAGE, this.initOnStage);
                    CEFObject_16.CEFObject.initGlobals();
                }
                initOnStage(evt) {
                    CUtil_38.CUtil.trace("CWOZTutorDoc:Object OnStage");
                    removeEventListener(CEFEvent_11.CEFEvent.ADDED_TO_STAGE, this.initOnStage);
                    addEventListener(CEFEvent_11.CEFEvent.REMOVED_FROM_STAGE, this.doOffStage);
                    super.initOnStage(evt);
                    if (this.Stutor == null) {
                        this.Stutor = CEFRoot_29.CEFRoot.instantiateObject("CEFTutor");
                        this.Stutor.name = "Stutor";
                        this.Stutor.setTutorDefaults(this._tutorFeatures);
                        this.Stutor.setTutorFeatures("");
                        this.addChild(this.Stutor);
                    }
                    CEFDoc_6.CEFDoc.tutorAutoObj = this.Stutor.tutorAutoObj;
                    this.Stutor.initializeScenes();
                    this.Stutor.initAutomation(CEFDoc_6.CEFDoc.tutorAutoObj);
                    this.Stutor.replaceCursor();
                    this.launchTutors();
                }
                doOffStage(evt) {
                    CUtil_38.CUtil.trace("going off stage");
                    removeEventListener(CEFEvent_11.CEFEvent.REMOVED_FROM_STAGE, this.doOffStage);
                    addEventListener(CEFEvent_11.CEFEvent.ADDED_TO_STAGE, this.doOnStage);
                    if (!CEFRoot_29.CEFRoot.gTutor.isPaused) {
                        this._forcedPause = true;
                        CEFRoot_29.CEFRoot.gTutor.wozPause();
                    }
                    this.Stutor.setCursor(CEFCursorProxy_2.CEFCursorProxy.WOZREPLAY);
                }
                doOnStage(evt) {
                    CUtil_38.CUtil.trace("coming on stage");
                    removeEventListener(CEFEvent_11.CEFEvent.ADDED_TO_STAGE, this.doOnStage);
                    addEventListener(CEFEvent_11.CEFEvent.REMOVED_FROM_STAGE, this.doOffStage);
                    if (this._forcedPause) {
                        this._forcedPause = false;
                        CEFRoot_29.CEFRoot.gTutor.wozPlay();
                    }
                    this.Stutor.setCursor(CEFCursorProxy_2.CEFCursorProxy.WOZLIVE);
                }
                set extAccount(Obj) {
                    CEFRoot_29.CEFRoot.sessionAccount = Obj;
                }
                set extFTutorPart(str) {
                }
                set extFFullSignIn(val) {
                    CEFRoot_29.CEFRoot.fFullSignIn = (val == "true") ? true : false;
                }
                set extFDemo(val) {
                    CEFRoot_29.CEFRoot.fDemo = val;
                }
                set extFDebug(val) {
                    CEFRoot_29.CEFRoot.fDebug = val;
                }
                set extFRemoteMode(val) {
                    CEFRoot_29.CEFRoot.fRemoteMode = val;
                }
                set extFDeferDemoClick(val) {
                    CEFRoot_29.CEFRoot.fDeferDemoClick = (val == "true") ? true : false;
                }
                set extFSkillometer(val) {
                    CEFRoot_29.CEFRoot.fSkillometer = (val == "true") ? true : false;
                }
                set extTutorFeatures(ftrStr) {
                    this._tutorFeatures = ftrStr;
                }
                set extLoader(val) {
                    this._extLoader = (val == "true") ? true : false;
                }
                get extLoaded() {
                    return this._extLoader;
                }
                set extmodPath(val) {
                    this._modulePath = val;
                }
                set extLogManager(val) {
                    this.gLogR = val;
                }
                set extSceneDescr(val) {
                    CEFRoot_29.CEFRoot.gSceneConfig = JSON.parse(val);
                }
                set extSceneGraph(val) {
                    CEFRoot_29.CEFRoot.gSceneGraphDesc = JSON.parse(val);
                }
                set extAnimationGraph(val) {
                    CEFRoot_29.CEFRoot.gAnimationGraphDesc = JSON.parse(val);
                }
                set extForceBackButton(fForce) {
                    if (typeof fForce === 'string')
                        this.gForceBackButton = (fForce == "true") ? true : false;
                    else if (typeof fForce === 'boolean')
                        this.gForceBackButton = fForce;
                }
                get extAspectRatio() {
                    return "STD";
                }
            };
            exports_79("CEFTutorDoc", CEFTutorDoc);
        }
    };
});
System.register("events/CEFAutomationEvent", [], function (exports_80, context_80) {
    "use strict";
    var __moduleName = context_80 && context_80.id;
    var Event, CEFAutomationEvent;
    return {
        setters: [],
        execute: function () {
            Event = createjs.Event;
            CEFAutomationEvent = class CEFAutomationEvent extends Event {
                constructor(type, Result, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                    this._result = Result;
                }
                clone() {
                    return new CEFAutomationEvent(this.type, this._result, this.bubbles, this.cancelable);
                }
            };
            CEFAutomationEvent.ENDPROMPT = "ENDPROMPT";
            exports_80("CEFAutomationEvent", CEFAutomationEvent);
        }
    };
});
System.register("events/CEFCaptionEvent", ["util/CUtil"], function (exports_81, context_81) {
    "use strict";
    var __moduleName = context_81 && context_81.id;
    var Event, CUtil_39, CEFCaptionEvent;
    return {
        setters: [
            function (CUtil_39_1) {
                CUtil_39 = CUtil_39_1;
            }
        ],
        execute: function () {
            Event = createjs.Event;
            CEFCaptionEvent = class CEFCaptionEvent extends Event {
                constructor(CapIndex, type = CEFCaptionEvent.WOZCAP, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                    this._CapIndex = CapIndex;
                }
                clone() {
                    CUtil_39.CUtil.trace("cloning WOZEvent:");
                    return new CEFCaptionEvent(this._CapIndex, this.type, this.bubbles, this.cancelable);
                }
            };
            CEFCaptionEvent.WOZCAP = "WOZCAPTION";
            exports_81("CEFCaptionEvent", CEFCaptionEvent);
        }
    };
});
System.register("events/CEFSelectEvent", ["util/CUtil"], function (exports_82, context_82) {
    "use strict";
    var __moduleName = context_82 && context_82.id;
    var Event, CUtil_40, CEFSelectEvent;
    return {
        setters: [
            function (CUtil_40_1) {
                CUtil_40 = CUtil_40_1;
            }
        ],
        execute: function () {
            Event = createjs.Event;
            CEFSelectEvent = class CEFSelectEvent extends Event {
                constructor(target, type, bubbles = false, cancelable = false) {
                    super(type, bubbles, cancelable);
                    this.wozSelection = target;
                }
                clone() {
                    CUtil_40.CUtil.trace("cloning CEFSelectEvent:");
                    return new CEFSelectEvent(this.wozSelection, this.type, this.bubbles, this.cancelable);
                }
            };
            CEFSelectEvent.WOZTABSELECT = "WOZTABSELECT";
            CEFSelectEvent.WOZIMGSELECT = "WOZIMGSELECT";
            exports_82("CEFSelectEvent", CEFSelectEvent);
        }
    };
});
System.register("kt/CEFProdSys", [], function (exports_83, context_83) {
    "use strict";
    var __moduleName = context_83 && context_83.id;
    var CWOZProdSys;
    return {
        setters: [],
        execute: function () {
            CWOZProdSys = class CWOZProdSys {
                constructor() {
                    this.resetWorkMem();
                }
                resetWorkMem() {
                    this.wm = new Object;
                }
                setWorkMem(prop, value) {
                    this.wm[prop] = value;
                }
                prop(_prop) {
                    return this.wm[_prop].toString();
                }
                value(_prop) {
                    return this.wm[_prop];
                }
                execRules() {
                    this.wm.rule0 = false;
                    this.wm.rule1 = false;
                    this.wm.rule2 = false;
                    this.wm.ruleTOV = false;
                    this.wm.ruleVVFAR = false;
                    this.wm.ruleCVSLOG = false;
                    if (this.wm.ramp == "NC") {
                        if (this.wm.reasoning == "PHRASE3") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                        }
                        else if (this.wm.reasoning == "PHRASE6") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                        }
                    }
                    else if (this.wm.ramp == "CVS") {
                        if (this.wm.reasoning == "PHRASE1") {
                            if (this.wm.CVSLogic == "TYPEA") {
                                this.wm.rule0 = true;
                                this.wm.rule1 = true;
                                this.wm.rule2 = true;
                                this.wm.ruleTOV = true;
                                this.wm.ruleVVFAR = true;
                            }
                            else if (this.wm.CVSLogic == "TYPEB") {
                                this.wm.rule0 = true;
                                this.wm.rule1 = true;
                                this.wm.rule2 = true;
                                this.wm.ruleTOV = true;
                                this.wm.ruleVVFAR = true;
                                this.wm.ruleCVSLOG = true;
                            }
                            else if (this.wm.CVSLogic == "TYPEC") {
                                this.wm.rule0 = true;
                                this.wm.rule1 = true;
                                this.wm.rule2 = true;
                            }
                        }
                        else if (this.wm.reasoning == "PHRASE3") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                                this.wm.rule1 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            this.wm.ruleVVFAR = true;
                        }
                        else if (this.wm.reasoning == "PHRASE6") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                                this.wm.rule1 = true;
                                this.wm.ruleVVFAR = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                        }
                    }
                    else if (this.wm.ramp == "CVS_WV") {
                        if (this.wm.reasoning == "PHRASE1") {
                            if (this.wm.CVSWVLogic == "TYPEA") {
                                this.wm.rule2 = true;
                            }
                            else if (this.wm.CVSWVLogic == "TYPEB") {
                                this.wm.rule1 = true;
                                this.wm.rule2 = true;
                                this.wm.ruleTOV = true;
                                this.wm.ruleVVFAR = true;
                                this.wm.ruleCVSLOG = true;
                            }
                            else if (this.wm.CVSWVLogic == "TYPEC") {
                                this.wm.rule1 = true;
                                this.wm.rule2 = true;
                            }
                        }
                        else if (this.wm.reasoning == "PHRASE3") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE3 == "true") {
                                this.wm.rule1 = true;
                            }
                            this.wm.ruleTOV = true;
                            this.wm.ruleVVFAR = true;
                        }
                        else if (this.wm.reasoning == "PHRASE6") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            if (this.wm.corrTYPE3 == "true") {
                                this.wm.rule1 = true;
                                this.wm.ruleVVFAR = true;
                            }
                        }
                    }
                    else if (this.wm.ramp == "SC") {
                        if (this.wm.reasoning == "PHRASE4") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            if (this.wm.corrTYPE3 == "true") {
                                this.wm.rule1 = true;
                            }
                            this.wm.ruleVVFAR = true;
                        }
                        else if (this.wm.reasoning == "PHRASE6") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            if (this.wm.corrTYPE3 == "true") {
                                this.wm.rule1 = true;
                                this.wm.ruleVVFAR = true;
                            }
                        }
                    }
                    else if (this.wm.ramp == "SC_WV") {
                        if (this.wm.reasoning == "PHRASE4") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            if (this.wm.corrTYPE3 == "true") {
                                this.wm.rule1 = true;
                            }
                            this.wm.ruleVVFAR = true;
                        }
                        else if (this.wm.reasoning == "PHRASE6") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            if (this.wm.corrTYPE3 == "true") {
                                this.wm.rule1 = true;
                                this.wm.ruleVVFAR = true;
                            }
                        }
                    }
                    else if (this.wm.ramp == "DC") {
                        if (this.wm.reasoning == "PHRASE4") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            if (this.wm.corrTYPE3 == "true") {
                                this.wm.rule1 = true;
                            }
                            this.wm.ruleVVFAR = true;
                        }
                        else if (this.wm.reasoning == "PHRASE6") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            if (this.wm.corrTYPE3 == "true") {
                                this.wm.rule1 = true;
                                this.wm.ruleVVFAR = true;
                            }
                        }
                    }
                    else if (this.wm.ramp == "MC") {
                        if (this.wm.reasoning == "PHRASE2") {
                            this.wm.rule1 = true;
                            this.wm.ruleVVFAR = true;
                        }
                        else if (this.wm.reasoning == "PHRASE3") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            this.wm.rule1 = true;
                            this.wm.ruleVVFAR = true;
                        }
                        else if (this.wm.reasoning == "PHRASE6") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            this.wm.rule1 = true;
                            this.wm.ruleVVFAR = true;
                        }
                    }
                    else if (this.wm.ramp == "HOTAT") {
                        if (this.wm.reasoning == "PHRASE4") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            if (this.wm.corrTYPE3 == "true") {
                                this.wm.rule1 = true;
                            }
                            this.wm.ruleVVFAR = true;
                        }
                        else if (this.wm.reasoning == "PHRASE6") {
                            if (this.wm.corrTYPE1 == "true") {
                                this.wm.rule0 = true;
                            }
                            if (this.wm.corrTYPE2 == "true") {
                                this.wm.ruleTOV = true;
                            }
                            if (this.wm.corrTYPE3 == "true") {
                                this.wm.rule1 = true;
                                this.wm.ruleVVFAR = true;
                            }
                        }
                    }
                }
            };
            exports_83("CWOZProdSys", CWOZProdSys);
        }
    };
});
System.register("navigation/CEFNavPanel", ["core/CEFSceneNavigator", "util/CUtil", "core/CEFObject"], function (exports_84, context_84) {
    "use strict";
    var __moduleName = context_84 && context_84.id;
    var CEFSceneNavigator_1, CUtil_41, CEFObject_17, CEFNavPanel;
    return {
        setters: [
            function (CEFSceneNavigator_1_1) {
                CEFSceneNavigator_1 = CEFSceneNavigator_1_1;
            },
            function (CUtil_41_1) {
                CUtil_41 = CUtil_41_1;
            },
            function (CEFObject_17_1) {
                CEFObject_17 = CEFObject_17_1;
            }
        ],
        execute: function () {
            CEFNavPanel = class CEFNavPanel extends CEFSceneNavigator_1.CEFSceneNavigator {
                constructor() {
                    super();
                    this.traceMode = false;
                    if (this.traceMode)
                        CUtil_41.CUtil.trace("CEFNavPanel:Constructor");
                    this.sceneCurr = 0;
                    this.scenePrev = 0;
                }
                initAutomation(_parentScene, scene, ObjIdRef, lLogger, lTutor) {
                    var sceneObj;
                    var wozObj;
                    var wozRoot;
                    this.objID = ObjIdRef + name;
                    for (var i1 = 0; i1 < this.numChildren; i1++) {
                        sceneObj = this.getChildAt(i1);
                        scene[sceneObj.name] = new Object;
                        scene[sceneObj.name].instance = sceneObj;
                        if (this.traceMode)
                            CUtil_41.CUtil.trace("\t\tCEFNavPanel found subObject named:" + sceneObj.name + " ... in-place: ");
                        if (sceneObj instanceof CEFObject_17.CEFObject) {
                            wozObj = sceneObj;
                            wozObj.initAutomation(_parentScene, scene[sceneObj.name], this.objID + ".", lLogger, lTutor);
                        }
                    }
                }
                setObjMode(TutScene, sMode) {
                    if (this.traceMode)
                        CUtil_41.CUtil.trace("\t*** Start - Walking Top Level Nav Objects***");
                    for (var sceneObj in TutScene) {
                        if (sceneObj != "instance" && TutScene[sceneObj].instance instanceof CEFObject_17.CEFObject) {
                            TutScene[sceneObj].instance.setAutomationMode(TutScene[sceneObj], sMode);
                        }
                    }
                    if (this.traceMode)
                        CUtil_41.CUtil.trace("\t*** End - Walking Top Level Nav Objects***");
                }
                dumpSceneObjs(TutScene) {
                    for (var sceneObj in TutScene) {
                        if (this.traceMode)
                            CUtil_41.CUtil.trace("\tNavPanelObj : " + sceneObj);
                        if (sceneObj != "instance" && TutScene[sceneObj].instance instanceof CEFObject_17.CEFObject) {
                            if (this.traceMode)
                                CUtil_41.CUtil.trace("\tCEF***");
                            TutScene[sceneObj].instance.dumpSubObjs(TutScene[sceneObj], "\t");
                        }
                    }
                }
            };
            exports_84("CEFNavPanel", CEFNavPanel);
        }
    };
});
System.register("scenes/CEFEndCloak", ["core/CEFRoot", "util/CUtil", "core/CEFSceneSequence"], function (exports_85, context_85) {
    "use strict";
    var __moduleName = context_85 && context_85.id;
    var CEFRoot_30, CUtil_42, CEFSceneSequence_4, CEFEndCloak;
    return {
        setters: [
            function (CEFRoot_30_1) {
                CEFRoot_30 = CEFRoot_30_1;
            },
            function (CUtil_42_1) {
                CUtil_42 = CUtil_42_1;
            },
            function (CEFSceneSequence_4_1) {
                CEFSceneSequence_4 = CEFSceneSequence_4_1;
            }
        ],
        execute: function () {
            CEFEndCloak = class CEFEndCloak extends CEFSceneSequence_4.CEFSceneSequence {
                constructor() {
                    super();
                    if (this.traceMode)
                        CUtil_42.CUtil.trace("CEFEndCloak:Constructor");
                }
                captureDefState(TutScene) {
                    super.captureDefState(TutScene);
                }
                restoreDefState(TutScene) {
                    super.restoreDefState(TutScene);
                }
                preEnterScene(lTutor, sceneLabel, sceneTitle, scenePage, Direction) {
                    if (this.traceMode)
                        CUtil_42.CUtil.trace("CEFEndCloak Pre-Enter Scene Behavior: " + sceneTitle);
                    CEFRoot_30.CEFRoot.gTutor.showPPlay(false);
                    CEFRoot_30.CEFRoot.gTutor.showReplay(false);
                    CEFRoot_30.CEFRoot.gTutor.SnavPanel.SnextButton.enableButton(false);
                    CEFRoot_30.CEFRoot.gTutor.SnavPanel.SbackButton.enableButton(false);
                    return super.preEnterScene(lTutor, sceneLabel, sceneTitle, scenePage, Direction);
                }
            };
            exports_85("CEFEndCloak", CEFEndCloak);
        }
    };
});
System.register("scenes/CEFEndScene", ["core/CEFSceneSequence", "events/CEFNavEvent", "util/CUtil"], function (exports_86, context_86) {
    "use strict";
    var __moduleName = context_86 && context_86.id;
    var CEFSceneSequence_5, CEFNavEvent_5, CUtil_43, CEFEndScene;
    return {
        setters: [
            function (CEFSceneSequence_5_1) {
                CEFSceneSequence_5 = CEFSceneSequence_5_1;
            },
            function (CEFNavEvent_5_1) {
                CEFNavEvent_5 = CEFNavEvent_5_1;
            },
            function (CUtil_43_1) {
                CUtil_43 = CUtil_43_1;
            }
        ],
        execute: function () {
            CEFEndScene = class CEFEndScene extends CEFSceneSequence_5.CEFSceneSequence {
                CEFEndScene() {
                    CUtil_43.CUtil.trace("CEFEndScene:Constructor");
                    this.fComplete = true;
                }
                onDoneClick(evt) {
                    this.dispatchEvent(new CEFNavEvent_5.CEFNavEvent(CEFNavEvent_5.CEFNavEvent.WOZNAVREPLAY));
                }
                onPostTest(evt) {
                }
                onUploadClick(evt) {
                    dispatchEvent(new Event("pushlog"));
                }
                captureDefState(TutScene) {
                    super.captureDefState(TutScene);
                }
                restoreDefState(TutScene) {
                    super.restoreDefState(TutScene);
                }
            };
            exports_86("CEFEndScene", CEFEndScene);
        }
    };
});
System.register("scenes/CEFSceneN", ["core/CEFRoot", "core/CEFSceneSequence", "events/CEFMouseEvent", "util/CUtil"], function (exports_87, context_87) {
    "use strict";
    var __moduleName = context_87 && context_87.id;
    var CEFRoot_31, CEFSceneSequence_6, CEFMouseEvent_10, CUtil_44, CEFSceneN;
    return {
        setters: [
            function (CEFRoot_31_1) {
                CEFRoot_31 = CEFRoot_31_1;
            },
            function (CEFSceneSequence_6_1) {
                CEFSceneSequence_6 = CEFSceneSequence_6_1;
            },
            function (CEFMouseEvent_10_1) {
                CEFMouseEvent_10 = CEFMouseEvent_10_1;
            },
            function (CUtil_44_1) {
                CUtil_44 = CUtil_44_1;
            }
        ],
        execute: function () {
            CEFSceneN = class CEFSceneN extends CEFSceneSequence_6.CEFSceneSequence {
                CEFSceneN() {
                    CUtil_44.CUtil.trace("CEFSceneN:Constructor");
                    this.SreplaySession.addEventListener(CEFMouseEvent_10.CEFMouseEvent.WOZCLICK, this.doReplay);
                }
                doReplay(evt) {
                    CEFRoot_31.CEFRoot.gTutor.replayLiveStream();
                }
                captureDefState(TutScene) {
                    super.captureDefState(TutScene);
                }
                restoreDefState(TutScene) {
                    super.restoreDefState(TutScene);
                }
            };
            exports_87("CEFSceneN", CEFSceneN);
        }
    };
});
System.register("scenes/CEFStartScene", ["core/CEFSceneSequence", "util/CUtil", "core/CEFRoot"], function (exports_88, context_88) {
    "use strict";
    var __moduleName = context_88 && context_88.id;
    var CEFSceneSequence_7, CUtil_45, CEFRoot_32, CEFStartScene;
    return {
        setters: [
            function (CEFSceneSequence_7_1) {
                CEFSceneSequence_7 = CEFSceneSequence_7_1;
            },
            function (CUtil_45_1) {
                CUtil_45 = CUtil_45_1;
            },
            function (CEFRoot_32_1) {
                CEFRoot_32 = CEFRoot_32_1;
            }
        ],
        execute: function () {
            CEFStartScene = class CEFStartScene extends CEFSceneSequence_7.CEFSceneSequence {
                CEFStartScene() {
                    this.traceMode = false;
                    if (this.traceMode)
                        CUtil_45.CUtil.trace("CEFStartScene:Constructor");
                    this.fComplete = true;
                }
                captureDefState(TutScene) {
                    super.captureDefState(TutScene);
                }
                restoreDefState(TutScene) {
                    super.restoreDefState(TutScene);
                }
                preEnterScene(lTutor, sceneLabel, sceneTitle, scenePage, Direction) {
                    if (this.traceMode)
                        CUtil_45.CUtil.trace("CEFStartScene Pre-Enter Scene Behavior: " + sceneTitle);
                    CEFRoot_32.CEFRoot.gTutor.showReplay(false);
                    CEFRoot_32.CEFRoot.gTutor.showPPlay(false);
                    return super.preEnterScene(lTutor, sceneLabel, sceneTitle, scenePage, Direction);
                }
                onEnterScene(Direction) {
                    if (this.traceMode)
                        CUtil_45.CUtil.trace("CEFStartScene Enter Scene Behavior: CEFRampScene0");
                }
                preExitScene(Direction, sceneCurr) {
                    if (this.traceMode)
                        CUtil_45.CUtil.trace("CEFStartScene Pre-Exit Scene Behavior:");
                    CEFRoot_32.CEFRoot.gTutor.showReplay(false);
                    CEFRoot_32.CEFRoot.gTutor.showPPlay(true);
                    return ("OK");
                }
            };
            exports_88("CEFStartScene", CEFStartScene);
        }
    };
});
//# sourceMappingURL=TutorEngineOne.js.map