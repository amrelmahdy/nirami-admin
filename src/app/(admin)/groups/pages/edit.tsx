import PageMetaData from '@/components/PageTitle'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { serverSideFormValidate } from '@/helpers/data'
import { ValidationError } from 'yup'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Button, Col, Row, Form, FormControl, FormGroup, FormLabel, Alert } from 'react-bootstrap'
import Feedback from 'react-bootstrap/esm/Feedback'
import { useNavigate, useParams } from 'react-router-dom'
import DropzoneFormInput from '@/components/form/DropzoneFormInput'
import { uploadCloudImages } from '@/helpers/services'
import { Category, useGetCategories } from '../../categories/categories.hooks'
import { useGetGroup, useUpdateGroup } from '../groups.hooks'

type ValidationErrorType = {
    name?: string
    message: string
}


const EditGroup = () => {


    const { groupId } = useParams<{ groupId: string }>();


    const { data: categories, isError: iscCategoriesError, isLoading: isCategoriesLoading } = useGetCategories();


    const { data: group, isError, isLoading } = useGetGroup(groupId || "");



    const navigate = useNavigate();



    const [serverError, setServerError] = useState("");

    const updateGroup = useUpdateGroup();


    const [image, setImage] = useState<File | undefined>(undefined);


    const [validated, setValidated] = useState(false)

    const [formErrors, setFormErrors] = useState<ValidationErrorType[]>([])



    const [formValue, setFormValue] = useState({
        arName: group?.name?.ar || '',
        enName: group?.name?.en || '',
        category: '',
    })


    // Add this effect to sync formValue with category data
    useEffect(() => {
        if (group) {
            setFormValue({
                arName: group.name?.ar || '',
                enName: group.name?.en || '',
                category: group?.category as unknown as string || '',
            });
        }
    }, [group]);


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


        const newGroup: any = {
            name: {
                ar: formValue.arName,
                en: formValue.enName
            },
            category: formValue.category
        }



        if (image) {
            const uploaded = await uploadCloudImages([image], `groups/${groupId}`);
            if (uploaded.length > 0) {
                newGroup.image = uploaded[0].url;
            }
        }


        updateGroup.mutate({
            id: groupId || "",
            group: newGroup
        }, {
            onSuccess: () => {
                navigate("/groups")
            }, onError: (error) => {
                setServerError(error.message || "Unknown error")
            }
        });
    }



    return (
        <>
            <PageMetaData title="تعديل مجموعة" />

            <Row>
                <Col xl={9}>
                    {
                        serverError !== "" && <Alert variant="danger" role="alert">
                            {serverError}
                        </Alert>
                    }
                    <ComponentContainerCard
                        id="custom-styles"
                        title="تعديل مجموعة"
                        description={
                            <>

                            </>
                        }>

                        {group && !isLoading &&
                            <Form className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
                                <FormGroup className="col-md-4">
                                    <FormLabel>الإسم العربي</FormLabel>
                                    <FormControl
                                        type="text"
                                        id="validationCustom01"
                                        name='arName'
                                        placeholder="الإسم بالعربي"
                                        defaultValue={group?.name?.ar || ""}
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
                                        defaultValue={group?.name?.en || ""}
                                        required
                                        onChange={handleChange}
                                    />
                                    <Feedback>صحيح</Feedback>
                                    <Feedback type="invalid">
                                        برجاء ادخال الاسم باللغة الإنجليزية
                                    </Feedback>
                                </FormGroup>


                                {!iscCategoriesError && !isCategoriesLoading
                                    && <FormGroup className="col-md-8">
                                        <FormLabel>الفئة</FormLabel>
                                        <Form.Select required onChange={(e) => {
                                            setFormValue({ ...formValue, category: e.target.value as string })
                                        }} aria-label="Default select example">
                                            <option value="">اختار الفئة</option>
                                            {categories?.map((category: Category, idx) => (
                                                <option key={idx}
                                                    selected={(group?.category as unknown as string) === category.id}
                                                    value={category.id}>
                                                    {category.name.ar}
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
                                        تعديل
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

export default EditGroup
