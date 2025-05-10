
import PageMetaData from '@/components/PageTitle'
import UIExamplesList from '@/components/UIExamplesList'
import AllFormValidation from '../../forms/validation/components/AllFormValidation'
import { ChangeEvent, FormEvent, useState } from 'react'
import { serverSideFormValidate } from '@/helpers/data'
import { ValidationError } from 'yup'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Button, Col, Row, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Alert } from 'react-bootstrap'
import Feedback from 'react-bootstrap/esm/Feedback'
import InputGroupText from 'react-bootstrap/esm/InputGroupText'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'
// import { useAddDepartment } from '../categories.hooks'
import { Department, useGetDepartments } from '../../departments/departments.hooks'
import DropzoneFormInput from '@/components/form/DropzoneFormInput'
import { uploadCloudImages } from '@/helpers/services'
import { Category, useAddCategory } from '../categories.hooks'

type ValidationErrorType = {
    name?: string
    message: string
}



const AddCategory = () => {

    const navigate = useNavigate();

    const [serverError, setServerError] = useState("");

    const addCategory = useAddCategory();



    const { data: departmentsList, isError, isLoading } = useGetDepartments();


    const [categoryImage, setCategoryImage] = useState<File | undefined>(undefined);

    const [validated, setValidated] = useState(false)

    const [formErrors, setFormErrors] = useState<ValidationErrorType[]>([])


    // const addDepartment = useAddDepartment();

    const [formValue, setFormValue] = useState({
        arName: '',
        enName: '',
        department: ''
    })

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


        if (categoryImage) {
            const uploaded = await uploadCloudImages([categoryImage], `categories`);
            newCategory.image = uploaded[0].url;
        }

        addCategory.mutate({
            ...newCategory
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
            <PageMetaData title="إضافة قسم" />

            <Row>
                <Col xl={9}>
                    {
                        serverError !== "" && <Alert variant="danger" role="alert">
                            {serverError}
                        </Alert>
                    }
                    <ComponentContainerCard
                        id="custom-styles"
                        title="إضافة فئة جديد"
                        description={
                            <>

                            </>
                        }>

                        {!isError && !isLoading && departmentsList?.length &&
                            <Form className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
                                <FormGroup className="col-md-4">
                                    <FormLabel>الإسم العربي</FormLabel>
                                    <FormControl type="text" id="validationCustom01" name='arName' placeholder="الإسم بالعربي" defaultValue="" required onChange={handleChange} />
                                    <Feedback>صحيح</Feedback>
                                    <Feedback type="invalid">
                                        برجاء ادخال الاسم باللغة العربية
                                    </Feedback>
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <FormLabel>الإسم بالإنجليزية</FormLabel>
                                    <FormControl type="text" id="validationCustom02" name='enName' placeholder="الإسم بالإنجليزية" defaultValue="" required onChange={handleChange} />
                                    <Feedback>صحيح</Feedback>
                                    <Feedback type="invalid">
                                        برجاء ادخال الاسم باللغة الإنجليزية
                                    </Feedback>
                                </FormGroup>

                                <Col lg={8}>
                                    <Form.Select onChange={(e) => {
                                        setFormValue({ ...formValue, department: e.target.value as string })
                                    }} aria-label="Default select example">
                                        <option value="">اختار القسم</option>
                                        {departmentsList?.map((department: Department, idx) => (
                                            <option key={idx} value={department.id}>
                                                {department.name.ar}
                                            </option>
                                        ))}
                                    </Form.Select>



                                    {/* <select>
                                        <option value="">اختار القسم</option>

                                        {departmentsList?.map((department: Department, idx) => (

                                            <option key={idx} value={department.id}>
                                                {department.name.ar}
                                            </option>
                                        ))}
                                    </select> */}

                                    {/* <ChoicesFormInput onChange={(val) => {
                                        console.log("formValue", categoryImage)
                                        //setFormValue({ ...formValue, department: val as string })
                                    }}>
                                        <option value="">اختار القسم</option>

                                        {departmentsList?.map((department: Department, idx) => (

                                            <option key={idx} value={department.id}>
                                                {department.name.ar}
                                            </option>
                                        ))}

                                    </ChoicesFormInput> */}
                                </Col>


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
                                            setCategoryImage(files[0])
                                        }}
                                        onRemoveFile={(_index) => {
                                            //categoryImage?.splice(index, 1)
                                            setCategoryImage(undefined)
                                        }}
                                    />
                                </Col>


                                <Col xs={12}>
                                    <Button disabled={formValue.arName === "" || formValue.enName === "" || formValue.department === ""} variant="primary" className="width-xl" type="submit">
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

export default AddCategory
