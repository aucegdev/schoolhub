import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

interface SchoolInput {
  schoolName?: string;
  tagline?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  website?: string;
  affiliationNumber?: string;
  board?: string;
  establishedYear?: number;
}

export async function getSchool() {
  const school = await prisma.school.findFirst();
  if (!school) {
    return null;
  }
  return school;
}

export async function upsertSchool(data: SchoolInput) {
  const existing = await prisma.school.findFirst();

  if (existing) {
    return prisma.school.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.school.create({
    data: {
      schoolName: data.schoolName || "Untitled School",
      ...data,
    },
  });
}

export async function updateLogo(filename: string) {
  const existing = await prisma.school.findFirst();
  if (!existing) {
    throw new NotFoundError("School");
  }

  return prisma.school.update({
    where: { id: existing.id },
    data: { logo: filename },
  });
}
