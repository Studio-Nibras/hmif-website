const programsService = require("./programs.service");
const {
  validateProgram,
  validateId,
  validateProgramFilters,
} = require("./programs.validation");
const { uploadImageToCloudinary } = require("./programs.upload");

async function getPrograms(req, res, next) {
  try {
    const validation = validateProgramFilters(req.query);

    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const result = await programsService.getPrograms(validation.data);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function getProgramById(req, res, next) {
  try {
    const id = validateId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID program tidak valid.",
      });
    }

    const program = await programsService.getProgramById(id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program tidak ditemukan.",
      });
    }

    return res.json({
      success: true,
      program,
    });
  } catch (error) {
    next(error);
  }
}

async function getDivisions(req, res, next) {
  try {
    const divisions = await programsService.getDivisions();

    return res.json({
      success: true,
      divisions,
    });
  } catch (error) {
    next(error);
  }
}

async function createProgram(req, res, next) {
  try {
    const validation = validateProgram(req.body);

    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const program = await programsService.createProgram(validation.data);

    return res.status(201).json({
      success: true,
      message: "Program berhasil ditambahkan.",
      program,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProgram(req, res, next) {
  try {
    const id = validateId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID program tidak valid.",
      });
    }

    const validation = validateProgram(req.body);

    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const program = await programsService.updateProgram(
      id,
      validation.data,
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program tidak ditemukan.",
      });
    }

    return res.json({
      success: true,
      message: "Program berhasil diperbarui.",
      program,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProgram(req, res, next) {
  try {
    const id = validateId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID program tidak valid.",
      });
    }

    const deleted = await programsService.deleteProgram(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Program tidak ditemukan.",
      });
    }

    return res.json({
      success: true,
      message: "Program berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
}

async function uploadImage(req, res, next) {
  try {
    const uploadedImage = await uploadImageToCloudinary(req.file.buffer);

    return res.status(201).json({
      success: true,
      message: "Gambar berhasil diunggah.",
      image: {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPrograms,
  getProgramById,
  getDivisions,
  createProgram,
  updateProgram,
  deleteProgram,
  uploadImage,
};
