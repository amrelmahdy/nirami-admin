import PageMetaData from '@/components/PageTitle'
import UIExamplesList from '@/components/UIExamplesList'
import AllFormValidation from '../../forms/validation/components/AllFormValidation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { serverSideFormValidate } from '@/helpers/data'
import { ValidationError } from 'yup'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Button, Col, Row, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Alert } from 'react-bootstrap'
import Feedback from 'react-bootstrap/esm/Feedback'
import InputGroupText from 'react-bootstrap/esm/InputGroupText'
import clsx from 'clsx'
import { useNavigate, useParams } from 'react-router-dom'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'
// import { useAddDepartment } from '../categories.hooks'
import { Department, useGetDepartments } from '../../departments/departments.hooks'
import DropzoneFormInput from '@/components/form/DropzoneFormInput'
import { uploadCloudImages } from '@/helpers/services'
import { Category, useGetCategories, useGetCategory, useUpdateCategory } from '../../categories/categories.hooks'
import { co } from 'node_modules/@fullcalendar/core/internal-common'

type ValidationErrorType = {
    name?: string
    message: string
}



const EditCategory = () => {


    const { categoryId } = useParams<{ categoryId: string }>();


    const { data: departments, isError: isDepartmentsError, isLoading: isDepartmantsLoading } = useGetDepartments();


    const { data: category, isError, isLoading } = useGetCategory(categoryId || "")



    const navigate = useNavigate();



    const [serverError, setServerError] = useState("");

    const updateCategory = useUpdateCategory();


    const [image, setImage] = useState<File | undefined>(undefined);


    const [validated, setValidated] = useState(false)

    const [formErrors, setFormErrors] = useState<ValidationErrorType[]>([])


    // const addDepartment = useAddDepartment();

    const [formValue, setFormValue] = useState({
        arName: category?.name?.ar || '',
        enName: category?.name?.en || '',
        department: '',
    })


    // Add this effect to sync formValue with category data
    useEffect(() => {
        if (category) {
            setFormValue({
                arName: category.name?.ar || '',
                enName: category.name?.en || '',
                department: category.department as unknown as string || '',
            });
        }
    }, [category]);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value })
    }



    const isValidInput = (name: string) => {
        return !formErrors.find((key) => key.name === name)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {


        event.preventDefault()
        event.stopPropagation()
        setValidated(true)
        const validationReply = (await serverSideFormValidate(formValue)) as ValidationError
        const allErrors: ValidationErrorType[] = []
        validationReply?.inner?.forEach((e) => {
            allErrors.push({
                name: e.path,
                message: e.message,
            })
        });
        setFormErrors(allErrors);


        const newCategory: any = {
            name: {
                ar: formValue.arName,
                en: formValue.enName
            },
            department: formValue.department
        }



        if (image) {
            const uploaded = await uploadCloudImages([image], `categories/${categoryId}`);
            if (uploaded.length > 0) {
                newCategory.image = uploaded[0].url;
            }
        }


        updateCategory.mutate({
            id: categoryId || "",
            category: newCategory
        }, {
            onSuccess: () => {
                navigate("/categories")
            }, onError: (error) => {
                setServerError(error.message || "Unknown error")
            }
        });
    }



    return (
        <>
            <PageMetaData title="تعديل فئة" />

            <Row>
                <Col xl={9}>
                    {
                        serverError !== "" && <Alert variant="danger" role="alert">
                            {serverError}
                        </Alert>
                    }
                    <ComponentContainerCard
                        id="custom-styles"
                        title="تعديل فئة"
                        description={
                            <>

                            </>
                        }>

                        {category && !isLoading &&
                            <Form className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
                                <FormGroup className="col-md-4">
                                    <FormLabel>الإسم العربي</FormLabel>
                                    <FormControl
                                        type="text"
                                        id="validationCustom01"
                                        name='arName'
                                        placeholder="الإسم بالعربي"
                                        defaultValue={category?.name?.ar || ""}
                                        required
                                        onChange={handleChange}
                                    />
                                    <Feedback>صحيح</Feedback>
                                    <Feedback type="invalid">
                                        برجاء ادخال الاسم باللغة العربية
                                    </Feedback>
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <FormLabel>الإسم بالإنجليزية</FormLabel>
                                    <FormControl
                                        type="text"
                                        id="validationCustom02"
                                        name='enName'
                                        placeholder="الإسم بالإنجليزية"
                                        defaultValue={category?.name?.en || ""}
                                        required
                                        onChange={handleChange}
                                    />
                                    <Feedback>صحيح</Feedback>
                                    <Feedback type="invalid">
                                        برجاء ادخال الاسم باللغة الإنجليزية
                                    </Feedback>
                                </FormGroup>


                                {!isDepartmentsError && !isDepartmantsLoading
                                    && <FormGroup className="col-md-8">
                                        <FormLabel>القسم</FormLabel>
                                        <Form.Select required onChange={(e) => {
                                            setFormValue({ ...formValue, department: e.target.value as string })
                                        }} aria-label="Default select example">
                                            <option value="">اختار القسم</option>
                                            {departments?.map((department: Department, idx) => (
                                                <option key={idx}
                                                    selected={(category?.department as unknown as string) === department.id}
                                                    value={department.id}>
                                                    {department.name.ar}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </FormGroup>}


                                <Col xs={8}>
                                    <DropzoneFormInput
                                        iconProps={{ icon: 'bx:cloud-upload', height: 36, width: 36 }}
                                        text="قم بإسقاط الملفات هنا أو انقر للتحميل."
                                        helpText={
                                            <span className="text-muted fs-13">
                                                الامتدادات المقبولة فقط هي .png، .jpeg، .jpg.
                                            </span>
                                        }
                                        maxFiles={1}
                                        showPreview
                                        onFileUpload={async (files) => {
                                            setImage(files[0])
                                        }}
                                        onRemoveFile={(_index) => {
                                            //categoryImage?.splice(index, 1)
                                            //setGroupImage(undefined)
                                        }}
                                    />
                                </Col>

                                {/* disabled={formValue.arName === "" || formValue.enName === ""}  */}

                                <Col xs={12}>
                                    <Button variant="primary" className="width-xl" type="submit">
                                        حفظ
                                    </Button>
                                </Col>
                            </Form>
                        }
                    </ComponentContainerCard>
                </Col>
            </Row>
        </>
    )
}

export default EditCategory
