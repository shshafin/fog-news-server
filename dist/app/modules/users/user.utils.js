"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminId = exports.findLastAdminId = exports.generateTeacherId = exports.findLastTeacherId = exports.generateStudentId = exports.findLastStudentId = void 0;
const admin_model_1 = require("../admin/admin.model");
const student_model_1 = require("../student/student.model");
const teacher_model_1 = require("../teacher/teacher.model");
// defalult student set
const findLastStudentId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastStudent = yield student_model_1.Student.findOne({ role: "student" }, { studentId: 1, class: 1, _id: 0 })
        .sort({
        createdAt: -1,
    })
        .lean();
    const currentYear = new Date().getFullYear();
    return (lastStudent === null || lastStudent === void 0 ? void 0 : lastStudent.studentId)
        ? `${lastStudent.studentId}`.substring(10)
        : undefined;
});
exports.findLastStudentId = findLastStudentId;
const generateStudentId = (className) => __awaiter(void 0, void 0, void 0, function* () {
    const currentYear = new Date().getFullYear().toString().substring(2);
    const currentId = (yield (0, exports.findLastStudentId)()) || (0).toString().padStart(3, "0"); //00000
    //increment by 1
    let incrementedId = (parseInt(currentId) + 1).toString().padStart(3, "0");
    //20 25
    incrementedId = `S-${currentYear}-${className}-${incrementedId}`;
    return incrementedId;
});
exports.generateStudentId = generateStudentId;
// default create teacher id
const findLastTeacherId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastTeacher = yield teacher_model_1.Teacher.findOne({ role: "teacher" }, { teacherId: 1, _id: 0 })
        .sort({
        createdAt: -1,
    })
        .lean();
    console.log("teacher Id", (lastTeacher === null || lastTeacher === void 0 ? void 0 : lastTeacher.teacherId) ? `${lastTeacher.teacherId}`.substring(2) : undefined);
    return (lastTeacher === null || lastTeacher === void 0 ? void 0 : lastTeacher.teacherId)
        ? `${lastTeacher.teacherId}`.substring(2)
        : undefined;
});
exports.findLastTeacherId = findLastTeacherId;
const generateTeacherId = () => __awaiter(void 0, void 0, void 0, function* () {
    // const currentId =
    //   (await findLastTeacherId()) || (0).toString().padStart(4, "0"); //00000
    // //increment by 1
    // let incrementedId = (parseInt(currentId) + 1).toString().padStart(4, "0");
    const currentId = (yield (0, exports.findLastTeacherId)()) || (0).toString().padStart(4, "0");
    const incrementedId = `T-${(parseInt(currentId) + 1).toString().padStart(4, "0")}`;
    // incrementedId = `T-${incrementedId}`;
    return incrementedId;
});
exports.generateTeacherId = generateTeacherId;
// set default admin id
const findLastAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastAdmin = yield admin_model_1.Admin.findOne({ role: "admin" }, { adminId: 1, _id: 0 })
        .sort({
        createdAt: -1,
    })
        .lean();
    return (lastAdmin === null || lastAdmin === void 0 ? void 0 : lastAdmin.adminId) ? `${lastAdmin.adminId}`.substring(2) : undefined;
});
exports.findLastAdminId = findLastAdminId;
const generateAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield (0, exports.findLastAdminId)()) || (0).toString().padStart(4, "0"); //00000
    //increment by 1
    let incrementedId = (parseInt(currentId) + 1).toString().padStart(4, "0");
    //20 25
    incrementedId = `A-${incrementedId}`;
    return incrementedId;
});
exports.generateAdminId = generateAdminId;
