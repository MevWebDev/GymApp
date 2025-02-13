"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var prisma_1 = require("../prisma/prisma");
var router = (0, express_1.Router)();
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var search, users, allUsers, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                search = req.query.search;
                if (!search) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma_1.default.user.findMany({
                        where: {
                            nick: { contains: String(search), mode: "insensitive" },
                        },
                        orderBy: { nick: "asc" },
                    })];
            case 1:
                users = _b.sent();
                res.json(users);
                return [2 /*return*/];
            case 2: return [4 /*yield*/, prisma_1.default.user.findMany({})];
            case 3:
                allUsers = _b.sent();
                res.json(allUsers);
                return [3 /*break*/, 5];
            case 4:
                _a = _b.sent();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, followers, following, completeUser, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                id = req.params.id;
                return [4 /*yield*/, prisma_1.default.user.findUnique({
                        where: { id: id },
                    })];
            case 1:
                user = _b.sent();
                return [4 /*yield*/, prisma_1.default.userFollow.findMany({
                        where: { followingId: id },
                        include: { follower: true },
                    })];
            case 2:
                followers = _b.sent();
                return [4 /*yield*/, prisma_1.default.userFollow.findMany({
                        where: { followerId: id },
                        include: { following: true },
                    })];
            case 3:
                following = _b.sent();
                if (!user || !followers || !following) {
                    res.status(404).json({ error: "User not found" });
                    return [2 /*return*/];
                }
                completeUser = __assign(__assign({}, user), { followers: followers, following: following });
                res.json(completeUser);
                return [3 /*break*/, 5];
            case 4:
                _a = _b.sent();
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get("/:id/workouts", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, workoutPlans, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma_1.default.workoutPlan.findMany({
                        where: { userId: id },
                        include: {
                            user: true,
                            exercises: { include: { exercise: true } },
                        },
                    })];
            case 1:
                workoutPlans = _a.sent();
                if (!workoutPlans) {
                    res.status(404).json({ error: "User not found" });
                    return [2 /*return*/];
                }
                res.json(workoutPlans);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching user workouts by ID:", error_1);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/create", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, nick, email, password, avatar, user, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, id = _a.id, nick = _a.nick, email = _a.email, password = _a.password, avatar = _a.avatar;
                return [4 /*yield*/, prisma_1.default.user.create({
                        data: {
                            id: id,
                            nick: nick,
                            email: email,
                            password: password,
                            avatar: avatar,
                        },
                    })];
            case 1:
                user = _b.sent();
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error("Error creating user:", error_2);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// @ts-ignore
router.patch("/update", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, nick, avatar, updatedUser, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, nick = _a.nick, avatar = _a.avatar;
                if (!id) {
                    return [2 /*return*/, res.status(400).json({ error: "User id is required." })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_1.default.user.update({
                        where: { id: id },
                        data: {
                            nick: nick,
                            avatar: avatar,
                        },
                    })];
            case 2:
                updatedUser = _b.sent();
                return [2 /*return*/, res.status(200).json(updatedUser)];
            case 3:
                error_3 = _b.sent();
                console.error("Error updating user:", error_3);
                return [2 /*return*/, res
                        .status(500)
                        .json({ error: "An error occurred while updating the profile." })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/:userId/saved-workouts", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userWithSaved, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_1.default.user.findUnique({
                        where: { id: userId },
                        include: {
                            savedWorkoutPlans: {
                                include: {
                                    user: true,
                                    exercises: {
                                        include: {
                                            exercise: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 2:
                userWithSaved = _a.sent();
                if (!userWithSaved) {
                    res.status(404).json({ error: "User not found." });
                    return [2 /*return*/];
                }
                res.status(200).json(userWithSaved.savedWorkoutPlans);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error("Error fetching saved workouts:", error_4);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/follow", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, followerId, followingId, userFollow, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, followerId = _a.followerId, followingId = _a.followingId;
                if (!followerId || !followingId) {
                    res.status(400).json({ error: "Missing followerId or followingId." });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_1.default.userFollow.create({
                        data: {
                            followerId: followerId,
                            followingId: followingId,
                        },
                    })];
            case 2:
                userFollow = _b.sent();
                res.status(200).json(userFollow);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                console.error("Error following user:", error_5);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// @ts-ignore
router.delete("/unfollow", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, followerId, followingId, deletedFollow, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, followerId = _a.followerId, followingId = _a.followingId;
                if (!followerId || !followingId) {
                    return [2 /*return*/, res.status(400).json({ error: "Missing userId or followerId." })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_1.default.userFollow.deleteMany({
                        where: {
                            followerId: followerId,
                            followingId: followingId,
                        },
                    })];
            case 2:
                deletedFollow = _b.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "User unfollowed successfully.", deletedFollow: deletedFollow })];
            case 3:
                error_6 = _b.sent();
                console.error("Error unfollowing user:", error_6);
                return [2 /*return*/, res.status(500).json({ error: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
