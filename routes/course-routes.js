const express = require('express');
const router = express.Router();
const {isAuth, isAdmin, upload} = require('../middleware')

const courseController = require('../controllers/course-controller');

router.get('/', courseController.getCourses);

router.get('/:titleSlug', courseController.getCourse);

router.use(isAuth)

router.get('/:titleSlug/register', courseController.getRegisterCourse);

router.post('/register', courseController.postRegisterCourse);

router.post('/unregister', courseController.postUnregisterCourse);


router.use(isAdmin)
router.get('/admin/create-course', courseController.getCreateCourse);
router.get('/admin/edit/:titleSlug', courseController.getEditCourse);
router.post('/admin/create-course', upload.courses.single('courseImage'), courseController.postCreateCourse);
router.post('/admin/edit/:titleSlug', upload.courses.single('courseImage'), courseController.postEditCourse);
router.post('/admin/delete/:titleSlug', courseController.postDeleteCourse);

module.exports = router;