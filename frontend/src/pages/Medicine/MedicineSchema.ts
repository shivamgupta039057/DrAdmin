import * as Yup from 'yup';
interface UpdateRow {
    _id: string,
    image: string | null,
    specialization: string,
    createdAt: string,
    updatedAt: string 
}
export const getValidationSchema = (updateRow: UpdateRow | undefined) =>
    Yup.object({
        specialization: Yup.string()
            .nullable()
            .when([], {
                is: () => !updateRow,
                then: (schema) => schema.required('Specialization is required'),
                otherwise: (schema) => schema.notRequired(),
            }),
        image: Yup.mixed()
            .nullable()
            .when([], {
                is: () => !updateRow,
                then: (schema) =>
                    schema
                        .required('An image is required')
                        .test('fileSize', 'File is too large', (value) => {
                            if (value && value instanceof File) {
                                return value.size <= 2 * 1024 * 1024; // 2MB max
                            }
                            return false;
                        })
                        .test('fileFormat', 'Unsupported file format', (value) => {
                            if (value && value instanceof File) {
                                return ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(value.type);
                            }
                            return false;
                        }),
                otherwise: (schema) => schema.notRequired(),
            }),
    });