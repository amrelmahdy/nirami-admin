
import PageMetaData from '@/components/PageTitle'
import UIExamplesList from '@/components/UIExamplesList'
import AllFormValidation from '../../forms/validation/components/AllFormValidation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { serverSideFormValidate } from '@/helpers/data'
import { ValidationError } from 'yup'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Button, Col, Row, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Alert, Spinner } from 'react-bootstrap'
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
import { co, s } from 'node_modules/@fullcalendar/core/internal-common'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'
import ReactQuill from 'react-quill'
// styles
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import { useGetAllSettings, useUpdateSettings } from '../settings.hooks'
import { set } from 'react-hook-form'
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
    parentProduct: string | null;
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



const valueSnow = `"في نيرامي، نحرص على توفير تجربة تسوق فاخرة وسلسة، ونسعى لضمان رضاكِ التام عن مشترياتكِ. إذا كنتِ بحاجة إلى استرجاع أي منتج، يمكنكِ القيام بذلك وفق الشروط التالية:\n\nشروط الاسترجاع:\n• تقديم طلب خلال 7 أيام من تاريخ استلام الطلب.\n• يجب أن يكون المنتج غير مستخدم، غير مفتوح، وفي عبوته الأصلية مع جميع الملحقات.\n\nالمنتجات غير القابلة للاسترجاع:\n• المنتجات المستخدمة أو المفتوحة.\n• المنتجات التالفة بسبب سوء الاستخدام.\n• المنتجات التي تم إزالة ختم الأمان منها.\n• الهدايا المجانية والعروض الترويجية.\n\nإثبات الشراء:\n• يجب تقديم رقم الطلب عند تقديم طلب الاسترجاع.\n\nطريقة طلب الاسترجاع:\n• رفع تذكرة عبر تطبيق نيرامي.\n• سيتم مراجعة الطلب خلال 48 ساعة والتواصل معكِ بشأن القبول أو الرفض.\n• في حال الموافقة، سيتم تزويدكِ بتعليمات إعادة المنتج.\n\nاسترداد المبلغ:\n• يتم الاسترداد بنفس وسيلة الدفع خلال 5-10 أيام عمل بعد استلام المنتج والتحقق من حالته.\n• قد تُخصم رسوم الشحن في بعض الحالات، ما لم يكن الخطأ من طرفنا.\n\nاستبدال المنتجات التالفة أو غير الصحيحة:\n• إذا استلمتِ منتجًا تالفًا أو غير مطابق، نرجو رفع تذكرة خلال 48 ساعة، وسنقوم بمعالجته فورًا عن طريق استبداله أو استرداد المبلغ بالكامل.\n\nللاستفسارات:\n• الاتصال بخدمة العملاء\n• إرسال بريد إلكتروني\n• رفع تذكرة عبر التطبيق`


const modules = {
    toolbar: [
        [{ font: [] }, { size: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'super' }, { script: 'sub' }],
        [{ header: [false, 1, 2, 3, 4, 5, 6] }, 'blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['direction', { align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
    ],
}



const Settings = () => {



    const navigate = useNavigate();


    const { data: settings, isLoading: isSettingsLoading, isError: isSettingsError } = useGetAllSettings();



    const [formValue, setFormValue] = useState({
        aboutUs: {
            ar: settings?.aboutUs?.ar || "",
            en: settings?.aboutUs?.ar || "",
        },
        ourStory: {
            ar: settings?.aboutUs?.ar || "",
            en: settings?.ourStory?.en || "",
        },
        returnAndExchangePolicy: {
            ar: settings?.returnAndExchangePolicy?.ar || "",
            en: settings?.returnAndExchangePolicy?.en || "",
        },
        contactWhatsapp: settings?.contactWhatsapp || "",
        contactPhone: settings?.contactPhone || "",
        contactEmail: settings?.contactEmail || "",
    })


    useEffect(() => {
        if (settings) {
            setFormValue({
                aboutUs: {
                    ar: settings?.aboutUs?.ar || "",
                    en: settings?.aboutUs?.ar || "",
                },
                ourStory: {
                    ar: settings?.aboutUs?.ar || "",
                    en: settings?.ourStory?.en || "",
                },
                returnAndExchangePolicy: {
                    ar: settings?.returnAndExchangePolicy?.ar || "",
                    en: settings?.returnAndExchangePolicy?.en || "",
                },
                contactWhatsapp: settings?.contactWhatsapp || "",
                contactPhone: settings?.contactPhone || "",
                contactEmail: settings?.contactEmail || "",
            });
        }
    }, [settings]);





    const [serverError, setServerError] = useState("");

 

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value })
    }



    const updateSettings = useUpdateSettings();




    const handleChangeSave = () => {
         updateSettings.mutate({
            settings: formValue 
        }, {
            onSuccess: () => {
                //navigate("/brands")
            }, onError: (error) => {
                //setServerError(error.message || "Unknown error")
            }
        });

        console.log("Submitting settings:", formValue);
    }


    return (
        <>
            <PageMetaData title="إضافة قسم" />

            {settings && !isSettingsLoading && <Row>
                <Col xl={12}>
                    {
                        serverError !== "" && <Alert variant="danger" role="alert">
                            {serverError}
                        </Alert>
                    }

                    <ComponentContainerCard
                        id="quill-snow-editor"
                        title="عن نيرامي بالعربية"
                        description={<></>}>
                        <ReactQuill id="snow-editor" modules={modules} defaultValue={settings?.aboutUs?.ar} theme="snow" onChange={(value) => {
                            setFormValue({ ...formValue, aboutUs: { ...formValue.aboutUs, ar: value } })
                        }} />
                    </ComponentContainerCard>

                    <ComponentContainerCard
                        id="quill-snow-editor"
                        title="عن نيرامي بالانجليزية"
                        description={<></>}>
                        <ReactQuill id="snow-editor" modules={modules} defaultValue={settings?.aboutUs?.en} theme="snow" onChange={(value) => {
                            setFormValue({ ...formValue, aboutUs: { ...formValue.aboutUs, en: value } })
                        }} />
                    </ComponentContainerCard>

                    <ComponentContainerCard
                        id="quill-snow-editor"
                        title="قصة نيرامي بالعربية"
                        description={<></>}>
                        <ReactQuill id="snow-editor" modules={modules} defaultValue={settings?.ourStory?.ar} theme="snow" onChange={(value) => {
                            setFormValue({ ...formValue, ourStory: { ...formValue.ourStory, ar: value } })
                        }} />
                    </ComponentContainerCard>


                    <ComponentContainerCard
                        id="quill-snow-editor"
                        title="قصة نيرامي بالانجليزية"
                        description={<></>}>
                        <ReactQuill id="snow-editor" modules={modules} defaultValue={settings?.ourStory?.en} theme="snow" onChange={(value) => {
                            setFormValue({ ...formValue, ourStory: { ...formValue.ourStory, en: value } })
                        }} />
                    </ComponentContainerCard>



                    <ComponentContainerCard
                        id="quill-snow-editor"
                        title="سياسة الاستبدال والاسترجاع بالعربية"
                        description={<></>}>
                        <ReactQuill id="snow-editor" modules={modules} defaultValue={settings?.returnAndExchangePolicy?.ar} theme="snow" onChange={(value) => {
                            setFormValue({ ...formValue, returnAndExchangePolicy: { ...formValue.returnAndExchangePolicy, ar: value } })
                        }} />
                    </ComponentContainerCard>

                    <ComponentContainerCard
                        id="quill-snow-editor"
                        title="سياسة الاستبدال والاسترجاع بالانجليزية"
                        description={<></>}>
                        <ReactQuill id="snow-editor" modules={modules} defaultValue={settings?.returnAndExchangePolicy?.en} theme="snow" onChange={(value) => {
                            setFormValue({ ...formValue, returnAndExchangePolicy: { ...formValue.returnAndExchangePolicy, en: value } })
                        }} />
                    </ComponentContainerCard>




                    <ComponentContainerCard
                        id="custom-styles"
                        title="">


                        <Row>
                            <Col xs={4}>
                                <FormGroup >
                                    <FormLabel>واتساب للتواصل</FormLabel>
                                    <FormControl type="text" id="validationCustom01" name='contactWhatsapp' placeholder="واتساب للتواصل" defaultValue={settings?.contactWhatsapp} required onChange={handleChange} />
                                    <Feedback>صحيح</Feedback>
                                    <Feedback type="invalid">
                                        برجاء ادخال الاسم باللغة العربية
                                    </Feedback>
                                </FormGroup>
                            </Col>
                            <Col xs={4}>
                                <FormGroup >
                                    <FormLabel>هاتف للتواصل</FormLabel>
                                    <FormControl type="text" id="validationCustom02" name='contactPhone' placeholder="هاتف للتواصل" defaultValue={settings?.contactPhone} required onChange={handleChange} />
                                    <Feedback>صحيح</Feedback>
                                    <Feedback type="invalid">
                                        برجاء ادخال الاسم باللغة الإنجليزية
                                    </Feedback>
                                </FormGroup>
                            </Col>
                            <Col xs={4}>
                                <FormGroup >
                                    <FormLabel>إيميل للتواصل</FormLabel>
                                    <FormControl type="text" id="validationCustom02" name='contactEmail' placeholder="إيميل للتواصل" defaultValue={settings?.contactEmail} required onChange={handleChange} />
                                    <Feedback>صحيح</Feedback>
                                    <Feedback type="invalid">
                                        برجاء ادخال الاسم باللغة الإنجليزية
                                    </Feedback>
                                </FormGroup>
                            </Col>
                        </Row>

                    </ComponentContainerCard>


                    <Button variant="primary" className="width-xl" onClick={handleChangeSave}>
                        {/* <Spinner color="white" className="spinner-border-sm me-1" /> */}
                        حفظ
                    </Button>

                    <div className="mb-3" />
                </Col>
            </Row>}
        </>
    )
}

export default Settings

