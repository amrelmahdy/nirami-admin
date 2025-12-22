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
import { Department, useGetDepartment, useGetDepartments, useUpdateDepartment } from '../../departments/departments.hooks'
import DropzoneFormInput from '@/components/form/DropzoneFormInput'
import { uploadCloudImages } from '@/helpers/services'
import { Category, useGetCategories } from '../../categories/categories.hooks'

type ValidationErrorType = {
    name?: string
    message: string
}



const EditDepartment = () => {


    const { departmentId } = useParams<{ departmentId: string }>();

    const { data: brand, isError, isLoading } = useGetDepartment(departmentId || "")



    const navigate = useNavigate();



    const [serverError, setServerError] = useState("");

    const updateBrand = useUpdateDepartment();


    const [image, setImage] = useState<File | undefined>(undefined);


    const [validated, setValidated] = useState(false)

    const [formErrors, setFormErrors] = useState<ValidationErrorType[]>([])


    // const addDepartment = useAddDepartment();

    const [formValue, setFormValue] = useState({
        arName: brand?.name?.ar || '',
        enName: brand?.name?.en || '',
    })


    // Add this effect to sync formValue with brand data
    useEffect(() => {
        if (brand) {
            setFormValue({
                arName: brand.name?.ar || '',
                enName: brand.name?.en || '',
            });
        }
    }, [brand]);

    
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

        const newBrand: any = {
            name: {
                ar: formValue.arName,
                en: formValue.enName
            },
        }


        if (image) {
            const uploaded = await uploadCloudImages([image], `departments/${departmentId}`);
            if (uploaded.length > 0) {
                newBrand.image = uploaded[0].url;
            }
        }


        updateBrand.mutate({
            id: departmentId || "",
            brand: newBrand 
        }, {
            onSuccess: () => {
                navigate("/departments")
            }, onError: (error) => {
                setServerError(error.message || "Unknown error")
            }
        });
    }



    return (
        <>
            <PageMetaData title="إضافة علامة تجارية جديدة" />

            <Row>
                <Col xl={9}>
                    {
                        serverError !== "" && <Alert variant="danger" role="alert">
                            {serverError}
                        </Alert>
                    }
                    <ComponentContainerCard
                        id="custom-styles"
                        title="تعديل القسم"
                        description={
                            <>

                            </>
                        }>

                        {brand && !isLoading &&
                            <Form className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
                                <FormGroup className="col-md-4">
                                    <FormLabel>الإسم العربي</FormLabel>
                                    <FormControl
                                        type="text"
                                        id="validationCustom01"
                                        name='arName'
                                        placeholder="الإسم بالعربي"
                                        defaultValue={brand?.name?.ar || ""}
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
                                        defaultValue={brand?.name?.en || ""}
                                        required
                                        onChange={handleChange}
                                    />
                                    <Feedback>صحيح</Feedback>
                                    <Feedback type="invalid">
                                        برجاء ادخال الاسم باللغة الإنجليزية
                                    </Feedback>
                                </FormGroup>
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

export default EditDepartment;
