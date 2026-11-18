const organizationService = require("./organization.service");
const {
  validateId,
  validateDivision,
  validateMember,
} = require("./organization.validation");
const { uploadImageToCloudinary } = require("./organization.upload");

async function getDivisions(req, res, next) {
  try {
    const divisions = await organizationService.getDivisions();
    res.json({ success: true, divisions });
  } catch (error) {
    next(error);
  }
}

async function createDivision(req, res, next) {
  try {
    const data = validateDivision(req.body || {});
    const division = await organizationService.createDivision(data);

    res.status(201).json({
      success: true,
      message: "Divisi berhasil ditambahkan.",
      division,
    });
  } catch (error) {
    next(error);
  }
}

async function updateDivision(req, res, next) {
  try {
    const id = validateId(req.params.id);
    const data = validateDivision(req.body || {});
    const division = await organizationService.updateDivision(id, data);

    if (!division) {
      return res.status(404).json({
        success: false,
        message: "Divisi tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: "Divisi berhasil diperbarui.",
      division,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteDivision(req, res, next) {
  try {
    const id = validateId(req.params.id);
    const deleted = await organizationService.deleteDivision(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Divisi tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: "Divisi berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
}

async function getMembers(req, res, next) {
  try {
    const filters = {};

    if (req.query.division_id) {
      filters.division_id = validateId(req.query.division_id);
    }

    if (req.query.is_active !== undefined) {
      if (!["0", "1"].includes(req.query.is_active)) {
        return res.status(400).json({
          success: false,
          message: "Filter status pengurus tidak valid.",
        });
      }

      filters.is_active = Number(req.query.is_active);
    }

    if (typeof req.query.search === "string") {
      filters.search = req.query.search.trim().slice(0, 100);
    }

    const members = await organizationService.getMembers(filters);

    res.json({ success: true, members });
  } catch (error) {
    next(error);
  }
}

async function getMemberById(req, res, next) {
  try {
    const id = validateId(req.params.id);
    const member = await organizationService.getMemberById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Pengurus tidak ditemukan.",
      });
    }

    res.json({ success: true, member });
  } catch (error) {
    next(error);
  }
}

async function createMember(req, res, next) {
  try {
    const data = validateMember(req.body || {});
    const member = await organizationService.createMember(data);

    res.status(201).json({
      success: true,
      message: "Pengurus berhasil ditambahkan.",
      member,
    });
  } catch (error) {
    next(error);
  }
}

async function updateMember(req, res, next) {
  try {
    const id = validateId(req.params.id);
    const data = validateMember(req.body || {});
    const member = await organizationService.updateMember(id, data);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Pengurus tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: "Data pengurus berhasil diperbarui.",
      member,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteMember(req, res, next) {
  try {
    const id = validateId(req.params.id);
    const deleted = await organizationService.deleteMember(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Pengurus tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: "Pengurus berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
}

async function uploadPhoto(req, res, next) {
  try {
    const uploadedImage = await uploadImageToCloudinary(req.file.buffer);

    res.status(201).json({
      success: true,
      message: "Foto pengurus berhasil diunggah.",
      image: {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getPublicOrganization(req, res, next) {
  try {
    const organization = await organizationService.getPublicOrganization();

    res.json({
      success: true,
      ...organization,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  uploadPhoto,
  getPublicOrganization,
};
