const server = require("../app");
const supertest = require("supertest");

const {pool} = require('../database/connection');

// returns a string representing a datetime on the same day
const getDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + String((today.getMonth() + 1)).padStart(2, '0') + '-' + String((today.getDate())).padStart(2, '0');
    const time = String(today.getHours() + 5).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0') + ':' + String(today.getSeconds()).padStart(2, '0');
    return `${date} ${time}`;
}

const saveTeacherToDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query =
                'INSERT INTO users (first_name, last_name, email, user_role, password, class_id) ' +
                'VALUES ("Kane", "Vasquez", "tester@yhoo.com", "TEACHER", "$2b$15$PGfdEXxNY2M.OSsh1mjIFuy9Tg32Z3Cc5QkKPGIW5f.DNVXpGYwOa", NULL);';
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                }
                resolve(result.insertId);
            });
            db.release();
        });
    })
}

const saveLectureToDB = (teacherId, dateTime) => {
    let lecture = {
        lecture_id: undefined,
        start_date_time: dateTime,
        course_id: 1,
        class_id: 1,
    }
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `INSERT INTO lectures (teacher_id, start_date_time, course_id, class_id) VALUES (${teacherId},"${dateTime}", 1, 1);`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    console.log('error inserting lecture...')
                    reject(error);
                }
                lecture.lecture_id = result.insertId;
                resolve(lecture);
            });
            db.release();
        });
    })
}

const saveCoursesToDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `INSERT INTO courses (course_id, name) VALUES (1, 'Development of Large Systems'),(2, 'Databases for Developers'),(3, 'Testing');`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    console.log('error inserting courses...')
                    reject(error);
                } else {
                    resolve(true);
                }
            });
            db.release();
        });
    })
}

const deleteLectureFromDB = (teacherId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `DELETE FROM lectures;`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
            db.release();
        });
    })
}

const deleteTeacherFromDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `DELETE FROM users;`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
               } else {
                    resolve(true);
                }
            });
            db.release();
        });
    })
}

const deleteCoursesFromDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, db) => {
            let query = `DELETE FROM courses;`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
            db.release();
        });
    })
}

describe('teacher tests', () => {

    test("GET /api/users/lectures/:teacherId", async () => {
        const dateTime = getDateTime();
        await saveCoursesToDB();
        const teacherId = await saveTeacherToDB();
        const lecture = await saveLectureToDB(teacherId, dateTime);
        await supertest(server).get(`/api/users/lectures/${teacherId}`)
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                expect(response.body.lecture_id).toEqual(lecture.lecture_id);
                expect(response.body.start_date_time).toEqual(dateTime);
                expect(response.body.name).toEqual('Development of Large Systems');
            }).catch(async () => {
                await deleteLectureFromDB(teacherId);
                await deleteTeacherFromDB(teacherId);
                await deleteCoursesFromDB();
            });
        await deleteLectureFromDB(teacherId);
        await deleteTeacherFromDB(teacherId);
        await deleteCoursesFromDB();
    }, 20000);

    test("GET /api/users/classes/courses/all/:teacherId", async () => {
        const dateTime = getDateTime();
        await saveCoursesToDB();
        const teacherId = await saveTeacherToDB();
        const lecture = await saveLectureToDB(teacherId, dateTime);
        await supertest(server).get(`/api/users/classes/courses/all/${teacherId}`)
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                expect(response.body.course_id).toEqual(1);
                expect(response.body.class_id).toEqual(1);
                expect(response.body.courseName).toEqual('Development of Large Systems');
            }).catch(async () => {
                await deleteLectureFromDB(teacherId);
                await deleteTeacherFromDB(teacherId);
                await deleteCoursesFromDB();
            });
        await deleteLectureFromDB(teacherId);
        await deleteTeacherFromDB(teacherId);
        await deleteCoursesFromDB();
    }, 20000);

    afterAll(()=> {
        pool.end();
    });

});
