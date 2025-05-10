
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
import DropzoneFormInput from '@/components/form/DropzoneFormInput'
import { uploadCloudImages } from '@/helpers/services'
import { Group, useGetGroups } from '../../groups/groups.hooks'
import { Department, useGetDepartments } from '../../departments/departments.hooks'
import { Category, useGetCategories } from '../../categories/categories.hooks'
import { Brand, useGetBrands } from '../../brands/brands.hooks'

type ValidationErrorType = {
    name?: string
    message: string
}


interface FormValue {
    arName: string;
    enName: string;
    arDescription: string;
    enDescription: string;
    arComponents: string;
    enComponents: string;
    brand: string;
    department: string;
    category: string;
    group: string;
    stock: number;
    price: number;
    salesPrice: number;
    maxQuantity: number;
    sku: string;
}

interface FormValue {
    arName: string;
    enName: string;
    arDescription: string;
    enDescription: string;
    arComponents: string;
    enComponents: string;
    brand: string;
    department: string;
    category: string;
    group: string;
    stock: number;
    price: number;
    salesPrice: number;
    maxQuantity: number;
    sku: string;
}

const validateForm = (form: FormValue): { isValid: boolean; errors: Partial<Record<keyof FormValue, string>> } => {
    const errors: Partial<Record<keyof FormValue, string>> = {};

    const requiredFields: (keyof FormValue)[] = [
        'arName', 'enName', 'arDescription', 'enDescription',
        'arComponents', 'enComponents', 'brand', 'department',
        'category', 'group', 'sku'
    ];

    requiredFields.forEach(field => {
        if (!form[field] || (typeof form[field] === 'string' && form[field].trim() === '')) {
            errors[field] = 'This field is required.';
        }
    });

    if (form.stock < 0) errors.stock = 'Stock cannot be negative.';
    if (form.price < 0) errors.price = 'Price cannot be negative.';
    if (form.salesPrice < 0) errors.salesPrice = 'Sales price cannot be negative.';
    if (form.maxQuantity < 1) errors.maxQuantity = 'Max quantity must be at least 1.';

    const isValid = Object.keys(errors).length === 0;
    return { isValid, errors };
};


const AddProduct = () => {

    const navigate = useNavigate();

    const [serverError, setServerError] = useState("");

    const [validated, setValidated] = useState(false)
    const [formErrors, setFormErrors] = useState<ValidationErrorType[]>([])

    const [productImage, setProductImage] = useState<File | undefined>(undefined);
    const [productImages, setProductImages] = useState<File[] | []>([]);




    // const addDepartment = useAddDepartment();

    const [formValue, setFormValue] = useState({
        arName: '',
        enName: '',
        arDescription: '',
        enDescription: '',
        arComponents: '',
        enComponents: '',
        brand: '',
        department: '',
        category: '',
        group: '',
        stock: 0,
        price: 0,
        salesPrice: 0,
        maxQuantity: 4,
        sku: ''
    })



    const { data: departmentsList, isDepartmentsError, isDepartmentsLoading } = useGetDepartments();
    const { data: categoriesList, isCategoriesError, isCategoriesLoading } = useGetCategories({ departmentId: formValue.department });
    const { data: groupsList, isGroupsError, isGroupsLoading } = useGetGroups({ categoryId: formValue.category });
    const { data: brandsList, isBrandsError, isBrandsLoading } = useGetBrands();



    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value })
    }


    console.log(validateForm(formValue))


    console.log("formValueformValueformValue", formValue)


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


        const newProduct: any = {
            name: {
                ar: formValue.arName,
                en: formValue.enName
            },
            description: {
                en: formValue.enDescription,
                ar: formValue.arDescription
            },
            components: {
                en: formValue.enComponents,
                ar: formValue.arComponents
            },
            sku: formValue.sku,
            price: formValue.price,
            salesPrice: formValue.salesPrice,
            brand: formValue.brand,
            group: formValue.group,
            stock: formValue.stock,
            maxQuantity: formValue.maxQuantity,

        }

        console.log(newProduct)


        // if (productImage) {
        //     const uploaded = await uploadCloudImages([productImage], `products`);
        //     newProduct.image = uploaded[0].url;
        // }

        // addDepartment.mutate(newProduct, {
        //     onSuccess: () => {
        //         navigate("/products")
        //     }, onError: (error) => {
        //         console.log("error", navigate)
        //         setServerError(error.message || "Unknown error")
        //     }
        // });
    }



    return (
        <>
            <PageMetaData title="إضافة قسم" />

            <Row>
                <Col xl={7}>
                    {
                        serverError !== "" && <Alert variant="danger" role="alert">
                            {serverError}
                        </Alert>
                    }
                    <ComponentContainerCard
                        id="custom-styles"
                        title="إضافة منتج جديد"
                        description={
                            <>

                            </>
                        }>

                        <Form className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>

                            <div className="mb-3" />

                            <Row>
                                <Col xs={6}>
                                    <FormGroup >
                                        <FormLabel>الإسم العربي</FormLabel>
                                        <FormControl type="text" id="validationCustom01" name='arName' placeholder="الإسم بالعربي" defaultValue="" required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال الاسم باللغة العربية
                                        </Feedback>
                                    </FormGroup>
                                </Col>
                                <Col xs={6}>
                                    <FormGroup >
                                        <FormLabel>الإسم بالإنجليزية</FormLabel>
                                        <FormControl type="text" id="validationCustom02" name='enName' placeholder="الإسم بالإنجليزية" defaultValue="" required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال الاسم باللغة الإنجليزية
                                        </Feedback>
                                    </FormGroup>
                                </Col>
                            </Row>



                            <div className="mb-3" />

                            <Row>
                                <Col xs={6}>
                                    <FormGroup >
                                        <FormLabel>الوصف العربي</FormLabel>
                                        <FormControl as="textarea" rows={3} id="validationCustom01" name='arDescription' placeholder="الوصف بالعربي" defaultValue="" required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال الوصف باللغة العربية
                                        </Feedback>
                                    </FormGroup>
                                </Col>
                                <Col xs={6}>
                                    <FormGroup >
                                        <FormLabel>الوصف بالإنجليزية</FormLabel>
                                        <FormControl as="textarea" rows={3} id="validationCustom02" name='enDescription' placeholder="الوصف بالإنجليزية" defaultValue="" required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال الوصف باللغة الإنجليزية
                                        </Feedback>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <div className="mb-3" />


                            <Row>
                                <Col xs={6}>
                                    <FormGroup >
                                        <FormLabel>المكونات العربي</FormLabel>
                                        <FormControl as="textarea" rows={3} id="validationCustom01" name='arComponents' placeholder="المكونات بالعربي" defaultValue="" required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال المكونات باللغة العربية
                                        </Feedback>
                                    </FormGroup>
                                </Col>
                                <Col xs={6}>
                                    <FormGroup >
                                        <FormLabel>المكونات بالإنجليزية</FormLabel>
                                        <FormControl as="textarea" rows={3} id="validationCustom02" name='enComponents' placeholder="المكونات بالإنجليزية" defaultValue="" required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال المكونات باللغة الإنجليزية
                                        </Feedback>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <div className="mb-3" />


                            <Row>
                                <Col xs={12}>
                                    <DropzoneFormInput
                                        iconProps={{ icon: 'bx:cloud-upload', height: 36, width: 36 }}
                                        text="قم بإسقاط صورة المنتج هنا أو انقر للتحميل."
                                        helpText={
                                            <span className="text-muted fs-13">
                                                الامتدادات المقبولة فقط هي .png، .jpeg، .jpg.
                                            </span>
                                        }
                                        maxFiles={1}
                                        showPreview
                                        onFileUpload={async (files) => {
                                            setProductImage(files[0])
                                        }}
                                        onRemoveFile={(_index) => {
                                            //departmentImage?.splice(index, 1)
                                            setProductImage(undefined)
                                        }}
                                    />

                                    <div className="mb-3" />

                                    <FormGroup >
                                        <FormLabel>الماركة</FormLabel>
                                        <Form.Select required onChange={(e) => {
                                            setFormValue({ ...formValue, brand: e.target.value as string })
                                        }} aria-label="Default select example">
                                            <option value="">اختار الماركة</option>
                                            {brandsList?.map((brand: Brand, idx) => (
                                                <option key={idx} value={brand.id}>
                                                    {brand.name.ar}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </FormGroup>

                                    <div className="mb-3" />



                                    {!isDepartmentsError && !isDepartmentsLoading && <FormGroup >
                                        <FormLabel>القسم</FormLabel>
                                        <Form.Select required onChange={(e) => {
                                            setFormValue({ ...formValue, department: e.target.value as string })
                                        }} aria-label="Default select example">
                                            <option value="">اختار القسم</option>
                                            {departmentsList?.map((department: Department, idx) => (
                                                <option key={idx} value={department.id}>
                                                    {department.name.ar}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </FormGroup>}

                                    <div className="mb-3" />


                                    {!isCategoriesError && !isCategoriesLoading && <FormGroup >
                                        <FormLabel>الفئة</FormLabel>
                                        <Form.Select disabled={formValue.department === ""} required onChange={(e) => {
                                            setFormValue({ ...formValue, category: e.target.value as string })
                                        }} aria-label="Default select example">
                                            <option value="">اختار الفئة</option>
                                            {categoriesList?.map((category: Category, idx) => (
                                                <option key={idx} value={category.id}>
                                                    {category.name.ar}
                                                    &nbsp;
                                                    ({category.department.name.ar})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </FormGroup>}

                                    <div className="mb-3" />

                                    {!isGroupsError && !isGroupsLoading && <FormGroup >
                                        <FormLabel>المجموعة</FormLabel>
                                        <Form.Select disabled={formValue.category === ""} required onChange={(e) => {
                                            setFormValue({ ...formValue, group: e.target.value as string })
                                        }} aria-label="Default select example">
                                            <option value="">اختار المجموعة</option>
                                            {groupsList?.map((group: Group, idx) => (
                                                <option key={idx} value={group.id}>
                                                    {group.name.ar}
                                                    &nbsp;
                                                    ({group.category.name.ar})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </FormGroup>}

                                    <div className="mb-3" />

                                    <FormGroup >
                                        <FormLabel>السعر</FormLabel>
                                        <FormControl type="number" id="validationCustom01" name='price' placeholder="برجاء ادخال السعر" defaultValue="" required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال السعر بالريال
                                        </Feedback>
                                    </FormGroup>


                                    <div className="mb-3" />


                                    <FormGroup >
                                        <FormLabel>سعر العرض</FormLabel>
                                        <FormControl type="number" id="validationCustom01" name='salesPrice' placeholder="برجاء ادخال سعر العرض" defaultValue="" required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال سعر العرض بالريال
                                        </Feedback>
                                    </FormGroup>


                                    <div className="mb-3" />

                                    <FormGroup >
                                        <FormLabel>المخزون</FormLabel>
                                        <FormControl type="number" id="validationCustom01" name='stock' placeholder="برجاء ادخال كمية المخزون" defaultValue="" required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال كمية المخزون
                                        </Feedback>
                                    </FormGroup>





                                    <div className="mb-3" />

                                    <FormGroup >
                                        <FormLabel>رمز التخزين</FormLabel>
                                        <FormControl type="text" id="validationCustom01" name='sku' placeholder="برجاء ادخال رمز التخزين" defaultValue="" required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال كمية المخزون
                                        </Feedback>
                                    </FormGroup>


                                    <div className="mb-3" />

                                    <FormGroup >
                                        <FormLabel>اقصي عدد للطلب</FormLabel>
                                        <FormControl type="number" id="validationCustom01" name='maxQuantity' placeholder="برجاء ادخال اقصي عدد للطلب" defaultValue={4} required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء اقصي عدد للطلب
                                        </Feedback>
                                    </FormGroup>

                                    <div className="mb-3" />


                                    <DropzoneFormInput
                                        iconProps={{ icon: 'bx:cloud-upload', height: 36, width: 36 }}
                                        text="قم بإسقاط الصور الخاصة بالمنتج هنا أو انقر للتحميل."
                                        helpText={
                                            <span className="text-muted fs-13">
                                                الامتدادات المقبولة فقط هي .png، .jpeg، .jpg.
                                            </span>
                                        }
                                        maxFiles={4}
                                        showPreview
                                        onFileUpload={async (files) => {
                                            setProductImages(files)
                                        }}
                                        onRemoveFile={(index) => {
                                            productImages?.splice(index, 1)
                                            setProductImages(productImages)
                                        }}
                                    />

                                    <div className="mb-3" />


                                </Col>

                            </Row>

                            <Col xs={12}>
                                <Button disabled={!validateForm(formValue).isValid} variant="primary" className="width-xl" type="submit">
                                    حفظ
                                </Button>
                            </Col>
                        </Form>
                    </ComponentContainerCard>
                </Col>
            </Row>
        </>
    )
}

export default AddProduct


// @Prop({ default: false })
// isOutOfStock: boolean;

// @Prop({ default: false })
// isOnSale: boolean;

// @Prop({ default: false })
// isFeatured: boolean;

// @Prop({ default: false })
// isPublished: boolean;