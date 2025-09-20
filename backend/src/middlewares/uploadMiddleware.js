import multer from "multer";
import path from "path";
import { UPLOAD_DIR } from "../config/env.js";
const uploadDir = path.join(process.cwd(), UPLOAD_DIR);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = /jpeg|jpg|png|gif/;
	const extname = allowedFileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = allowedFileTypes.test(file.mimetype);
	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb("Error: Images Only!");
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
