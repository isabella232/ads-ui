import React, { Component, useState, useEffect, useContext } from 'react';
import { Icon } from '@material-ui/core';
import * as S from "./styles/CreativeNew.style";
import Section from '../../../../components/section/Section';
import { Divider, Input, InputContainer, Selection, Button, MessageContainer, ErrorIcon, SuccessIcon, Message } from "../../../../components/formElements/formElements";
import { Text } from "../../../../components/Text/Text";

import { useQuery, useMutation } from '@apollo/react-hooks';
import { CREATE_NOTIFICATION_CREATIVE, CREATE_IN_PAGE_CREATIVE, CREATE_NEW_TAB_PAGE_CREATIVE } from "./lib/CreativeNew.queries";
import Select from 'react-select';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "#fafafa"
    }),
}

const statusTypes = [
    { value: 'draft', label: 'Draft' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'deleted', label: 'Deleted' },
    { value: 'paused', label: 'Paused' },
]

const CreativeNew = props => {

    const [name, setName] = useState('');
    const [status, setStatus] = useState({ value: 'active', label: 'Active' });
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [targetUrl, setTargetUrl] = useState('');
    const [size, setSize] = useState('');
    const [creativeUrl, setCreativeUrl] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [logoAltText, setLogoAltText] = useState('');
    const [logoCompanyName, setLogoCompanyName] = useState('');
    const [wallpapers, setWallpapers] = useState([{ imageUrl: '', focalPoint: { x: undefined, y: undefined } }]);
    const [type, setType] = useState('notification_all_v1');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [validations, setValidations] = useState({} as any);

    const updateCreative = data => {
        setError(false);
        setSuccess(true);
        setSaving(false);

        let creativeId;
        if (data.createNotificationCreative) {
            creativeId = data.createNotificationCreative.id
        }
        else if (data.createInPageCreative) {
            creativeId = data.createInPageCreative.id
        }
        else if (data.createNewTabPageCreative) {
            creativeId = data.createNewTabPageCreative.id
        }

        setTimeout(() => {
            props.history.push(`/admin/main/users/:userId/advertiser/:advertiserId/creative/${creativeId}`)
        }, 3000)

    }

    const [createNotificationCreative, { loading: createNotificationCreativeLoading, error: createNotificationCreativeError }] =
        useMutation(CREATE_NOTIFICATION_CREATIVE, {
            variables: {
                createNotificationCreativeInput: {
                    userId: props.match.params.userId,
                    advertiserId: props.match.params.advertiserId,
                    creativeId: props.match.params.creativeId,
                    state: status.value,
                    name,
                    type: {
                        code: "notification_all_v1",
                        name: "notification"
                    },
                    payload: {
                        title,
                        body,
                        targetUrl
                    }
                }
            },
            onCompleted: updateCreative
        });

    const [createInPageCreative, { loading: mutationLoading, error: mutationError }] =
        useMutation(CREATE_IN_PAGE_CREATIVE, {
            variables: {
                createInPageCreativeInput: {
                    userId: props.match.params.userId,
                    advertiserId: props.match.params.advertiserId,
                    creativeId: props.match.params.creativeId,
                    name,
                    state: status.value,
                    type: {
                        code: "in_page_all_v1",
                        name: "in_page"
                    },
                    payload: {
                        size,
                        creativeUrl,
                        targetUrl
                    }
                }
            },
            onCompleted: updateCreative
        });

    const [createNewTabPageCreative, { loading: newTabPageLoading, error: newTabPageError }] =
        useMutation(CREATE_NEW_TAB_PAGE_CREATIVE, {
            variables: {
                createNewTabPageCreativeInput: {
                    advertiserId: props.match.params.advertiserId,
                    creativeId: props.match.params.creativeId,
                    name,
                    state: status.value,
                    type: {
                        code: "new_tab_page_all_v1",
                        name: "new_tab_page"
                    },
                    payload: {
                        logo: {
                            imageUrl: logoUrl,
                            alt: logoAltText,
                            companyName: logoCompanyName,
                            destinationUrl: targetUrl
                        },
                        wallpapers: wallpapers
                    }
                }
            },
            onCompleted: updateCreative
        });

    const validateForm = () => {
        let validations = {} as any;
        setSuccess(false);
        setSaving(true);

        // Validate form
        if (name === '') {
            validations.nameValidation = "Name field is required";
        }
        if (targetUrl === '') {
            validations.targetUrlValidation = "Website URL field is required";
        }
        if (title === '' && type === "notification_all_v1") {
            validations.titleRequired = "Title field is required";
        }
        if (body === '' && type === "notification_all_v1") {
            validations.bodyRequired = "Body field is required";
        }
        if (size === '' && type === "in_page_all_v1") {
            validations.sizeRequired = "Size field is required";
        }
        if (creativeUrl === '' && type === "in_page_all_v1") {
            validations.creativeUrlRequired = "Image URL field is required";
        }

        // If errors: set error state true and set validations object
        if (Object.entries(validations).length > 0) {
            setValidations(validations);
            setError(true);
            setSaving(false);
            return false;
        }
        else {
            setValidations({} as any);
            return true;
        }
    }

    const handleLogoUpload = () => {
        document.getElementById("logoUpload")?.click();
    }

    const handleWallpaperUpload = (i) => {
        document.getElementById(`wallpaperUpload-${i}`)?.click();
    }

    const setWallpaperImageUrl = (imageUrl, i) => {
        let wallpapersTemp = [...wallpapers];
        wallpapersTemp[i].imageUrl = imageUrl;
        //@ts-ignore
        setWallpapers(wallpapersTemp);
    }

    const setWallpaperX = (x, i) => {
        let wallpapersTemp = [...wallpapers];
        wallpapersTemp[i].focalPoint.x = x;
        //@ts-ignore
        setWallpapers(wallpapersTemp);
    }

    const setWallpaperY = (y, i) => {
        let wallpapersTemp = [...wallpapers];
        wallpapersTemp[i].focalPoint.y = y;
        //@ts-ignore
        setWallpapers(wallpapersTemp);
    }

    const addWallpaper = () => {
        let wallpapersTemp = [...wallpapers];
        wallpapersTemp.push({ imageUrl: '', focalPoint: { x: undefined, y: undefined } });
        //@ts-ignore
        setWallpapers(wallpapersTemp);
    }


    const renderWallpapers = () => {
        return wallpapers.map((wallpaper, i) => {
            return <>
                {i > 0 && <Divider />}
                <div style={{ display: "flex" }}>
                    <InputContainer style={{ width: "100%", marginRight: "24px" }}>
                        <div style={{ display: "flex" }}>
                            <Text content={"Image URL"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                        </div>
                        <Input value={wallpapers[i].imageUrl} onChange={event => setWallpaperImageUrl(event.target.value, i)}></Input>
                    </InputContainer>
                    <Input id={`wallpaperUpload-${i}`} onChange={event => setWallpaperImageUrl(event.target.value, i)} type="file" style={{ display: "none" }} />
                    <Button onClick={() => { handleWallpaperUpload(i) }} style={{ height: "32px", marginTop: "26px", marginLeft: "auto", backgroundColor: "#4C54D2" }}>
                        <Text content={"Upload"} style={{ paddingTop: "6px", paddingBottom: "6px" }} sizes={[16, 16, 15, 15, 14]} fontWeight={500} fontFamily={"Poppins"} />
                    </Button>
                </div>
                <InputContainer>
                    <div style={{ display: "flex" }}>
                        <Text content={"X-Focal-Point"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                    </div>
                    <Input value={wallpapers[i].focalPoint.x} onChange={event => setWallpaperX(Number(event.target.value), i)}></Input>
                </InputContainer>
                <InputContainer>
                    <div style={{ display: "flex" }}>
                        <Text content={"Y-Focal-Point"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                    </div>
                    <Input value={wallpapers[i].focalPoint.y} onChange={event => setWallpaperY(Number(event.target.value), i)}></Input>
                </InputContainer>
            </>
        })
    }

    return (
        <>
            <div style={{ display: "flex", marginTop: "28px", width: "100%" }}>
                <div style={{ width: "720px" }}>

                    {
                        success &&
                        <MessageContainer style={{ marginBottom: "28px" }}>
                            <SuccessIcon>
                                <Icon style={{ color: "white", fontSize: "24px" }}>done</Icon>
                            </SuccessIcon>
                            <Message>
                                <Text content={"Creative saved successfully. Redirecting..."} sizes={[16, 16, 15, 15, 14]} fontFamily={"Poppins"} />
                            </Message>
                        </MessageContainer>
                    }

                    {
                        error &&
                        <MessageContainer style={{ marginBottom: "28px" }}>
                            <ErrorIcon>
                                <Icon style={{ color: "white", fontSize: "24px" }}>info</Icon>
                            </ErrorIcon>
                            <Message>
                                <Text content={"Oops! Unable to submit form, please update highlighted fields and try again."} sizes={[16, 16, 15, 15, 14]} fontFamily={"Poppins"} />
                            </Message>
                        </MessageContainer>
                    }

                    <Section fullWidthChild={true}>
                        <>
                            <Text content={"Creative Details"} sizes={[16, 16, 15, 15, 18]} fontFamily={"Poppins"} />
                            <div style={{ display: "flex" }}>
                                <Text content={"Define the look and feel of your Ads."} style={{ marginTop: "2px", marginBottom: "28px" }} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                <Text title="Wiki's coming soon!" content={"Learn More."} color={"#E0694C"} style={{ marginTop: "2px", marginBottom: "28px", marginLeft: "4px", cursor: "pointer" }} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                            </div>



                            <InputContainer>
                                <div style={{ display: "flex" }}>
                                    <Text content={"Creative Type"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                    <Icon style={{ fontSize: "16px", color: "#ACB0B5", marginTop: "1px", marginLeft: "2px" }}>info</Icon>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                                    <Selection onClick={() => { setType("notification_all_v1"); setValidations({}); setError(false); setName(''); setTargetUrl('') }} selected={type === "notification_all_v1"}>
                                        <Text content={"OS Notification"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        <Icon style={{ fontSize: "16px", color: "#ACB0B5", marginTop: "-2px", marginLeft: "3px" }}>info</Icon>
                                    </Selection>
                                    <Selection onClick={() => { setType("in_page_all_v1"); setValidations({}); setError(false); setName(''); setTargetUrl('') }} selected={type === "in_page_all_v1"}>
                                        <Text content={"In-Page Image"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        <Icon style={{ fontSize: "16px", color: "#ACB0B5", marginTop: "-2px", marginLeft: "3px" }}>info</Icon>
                                    </Selection>
                                    <Selection onClick={() => { setType("new_tab_page_all_v1"); setValidations({}); setError(false); setName(''); setTargetUrl('') }} selected={type === "new_tab_page_all_v1"}>
                                        <Text content={"New Tab Page"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        <Icon style={{ fontSize: "16px", color: "#ACB0B5", marginTop: "-2px", marginLeft: "3px" }}>info</Icon>
                                    </Selection>
                                </div>
                            </InputContainer>

                            <InputContainer>
                                <div style={{ display: "flex" }}>
                                    <Text content={"Creative Name"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                </div>
                                {
                                    !validations.nameValidation ?
                                        <Input value={name} onChange={event => setName(event.target.value)}></Input>
                                        :
                                        <>
                                            <Input error={true} value={name} onChange={event => setName(event.target.value)}></Input>
                                            <Text style={{ marginTop: "4px" }} color={"#E32444"} content={validations.nameValidation} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        </>
                                }

                            </InputContainer>

                            <InputContainer>
                                <div style={{ display: "flex" }}>
                                    <Text content={"Website URL"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                </div>
                                {
                                    !validations.targetUrlValidation ?
                                        <Input value={targetUrl} onChange={event => setTargetUrl(event.target.value)}></Input>
                                        :
                                        <>
                                            <Input error={true} value={targetUrl} onChange={event => setTargetUrl(event.target.value)}></Input>
                                            <Text style={{ marginTop: "4px" }} color={"#E32444"} content={validations.targetUrlValidation} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        </>
                                }
                            </InputContainer>

                            <InputContainer>
                                <div style={{ display: "flex", marginBottom: "4px" }}>
                                    <Text content={"State"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                </div>
                                <Select
                                    styles={customStyles}
                                    onChange={setStatus}
                                    value={status}
                                    options={statusTypes}
                                />

                            </InputContainer>
                            <Divider />

                            {
                                type === "notification_all_v1" &&
                                <>
                                    <Text content={"Creative"} sizes={[16, 16, 15, 15, 18]} fontFamily={"Poppins"} />
                                    <div style={{ display: "flex" }}>
                                        <Text content={"Define the copy and text used in your creative."} style={{ marginTop: "2px", marginBottom: "28px" }} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        <Text title="Wiki's coming soon!" content={"Learn More."} color={"#E0694C"} style={{ marginTop: "2px", marginBottom: "28px", marginLeft: "4px", cursor: "pointer" }} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                    </div>
                                    <InputContainer>
                                        <div style={{ display: "flex" }}>
                                            <Text content={"Title"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        </div>
                                        {
                                            !validations.titleRequired ?
                                                <Input value={title} onChange={event => setTitle(event.target.value)}></Input>
                                                :
                                                <>
                                                    <Input error={true} value={title} onChange={event => setTitle(event.target.value)}></Input>
                                                    <Text style={{ marginTop: "4px" }} color={"#E32444"} content={validations.titleRequired} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                                </>
                                        }
                                    </InputContainer>
                                    <InputContainer>
                                        <div style={{ display: "flex" }}>
                                            <Text content={"Body"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        </div>
                                        {
                                            !validations.bodyRequired ?
                                                <Input value={body} onChange={event => setBody(event.target.value)}></Input>
                                                :
                                                <>
                                                    <Input error={true} value={body} onChange={event => setBody(event.target.value)}></Input>
                                                    <Text style={{ marginTop: "4px" }} color={"#E32444"} content={validations.bodyRequired} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                                </>
                                        }
                                    </InputContainer>
                                </>

                            }
                            {
                                type === "in_page_all_v1" &&
                                <>
                                    <Text content={"Creative"} sizes={[16, 16, 15, 15, 18]} fontFamily={"Poppins"} />
                                    <div style={{ display: "flex" }}>
                                        <Text content={"Define the copy and text used in your creative."} style={{ marginTop: "2px", marginBottom: "28px" }} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        <Text title="Wiki's coming soon!" content={"Learn More."} color={"#E0694C"} style={{ marginTop: "2px", marginBottom: "28px", marginLeft: "4px", cursor: "pointer" }} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                    </div>
                                    <InputContainer>
                                        <div style={{ display: "flex" }}>
                                            <Text content={"Size"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        </div>
                                        {
                                            !validations.sizeRequired ?
                                                <Input value={size} onChange={event => setSize(event.target.value)}></Input>
                                                :
                                                <>
                                                    <Input error={true} value={size} onChange={event => setSize(event.target.value)}></Input>
                                                    <Text style={{ marginTop: "4px" }} color={"#E32444"} content={validations.sizeRequired} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                                </>
                                        }
                                    </InputContainer>
                                    <InputContainer>
                                        <div style={{ display: "flex" }}>
                                            <Text content={"Image URL"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        </div>
                                        {
                                            !validations.creativeUrlRequired ?
                                                <Input value={creativeUrl} onChange={event => setCreativeUrl(event.target.value)}></Input>
                                                :
                                                <>
                                                    <Input error={true} value={creativeUrl} onChange={event => setCreativeUrl(event.target.value)}></Input>
                                                    <Text style={{ marginTop: "4px" }} color={"#E32444"} content={validations.creativeUrlRequired} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                                </>
                                        }
                                    </InputContainer>
                                </>
                            }
                            {
                                type === "new_tab_page_all_v1" &&
                                <>
                                    <Text content={"Logo"} sizes={[16, 16, 15, 15, 18]} fontFamily={"Poppins"} />
                                    <div style={{ display: "flex" }}>
                                        <Text content={"Define the copy and text used in your logo."} style={{ marginTop: "2px", marginBottom: "28px" }} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        <Text title="Wiki's coming soon!" content={"Learn More."} color={"#E0694C"} style={{ marginTop: "2px", marginBottom: "28px", marginLeft: "4px", cursor: "pointer" }} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <InputContainer style={{ width: "100%", marginRight: "24px" }}>
                                            <div style={{ display: "flex" }}>
                                                <Text content={"Image URL"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                            </div>
                                            <Input value={logoUrl} onChange={event => setLogoUrl(event.target.value)}></Input>
                                        </InputContainer>
                                        <Input onChange={event => setLogoUrl(event.target.value)} id="logoUpload" type="file" style={{ display: "none" }} />
                                        <Button onClick={() => { handleLogoUpload() }} style={{ height: "32px", marginTop: "26px", marginLeft: "auto", backgroundColor: "#4C54D2" }}>
                                            <Text content={"Upload"} style={{ paddingTop: "6px", paddingBottom: "6px" }} sizes={[16, 16, 15, 15, 14]} fontWeight={500} fontFamily={"Poppins"} />
                                        </Button>

                                    </div>
                                    <InputContainer>
                                        <div style={{ display: "flex" }}>
                                            <Text content={"Alt Text"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        </div>
                                        <Input value={logoAltText} onChange={event => setLogoAltText(event.target.value)}></Input>
                                    </InputContainer>
                                    <InputContainer>
                                        <div style={{ display: "flex" }}>
                                            <Text content={"Company Name"} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        </div>
                                        <Input value={logoCompanyName} onChange={event => setLogoCompanyName(event.target.value)}></Input>
                                    </InputContainer>
                                    <Divider />
                                    <Text content={"Wallpapers"} sizes={[16, 16, 15, 15, 18]} fontFamily={"Poppins"} />
                                    <div style={{ display: "flex" }}>
                                        <Text content={"Define the copy and text used in your wallpapers."} style={{ marginTop: "2px", marginBottom: "28px" }} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                        <Text title="Wiki's coming soon!" content={"Learn More."} color={"#E0694C"} style={{ marginTop: "2px", marginBottom: "28px", marginLeft: "4px", cursor: "pointer" }} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                    </div>
                                    {renderWallpapers()}
                                    <div style={{ width: "99%", display: "flex", marginTop: "-12px", marginRight: "8px", marginBottom: "12px" }}>
                                        <Text onClick={() => { addWallpaper() }} content={"+ Create new wallpaper"} color={"#E0694C"} style={{ marginTop: "2px", marginLeft: "auto", cursor: "pointer" }} sizes={[16, 16, 15, 15, 13]} fontFamily={"Poppins"} />
                                    </div>
                                </>
                            }
                            <div style={{ display: "flex" }}>
                                {
                                    saving ?
                                        <Button style={{ marginLeft: "auto", marginTop: "28px", opacity: .7, cursor: "default" }}>
                                            <Text content={"Saving..."} style={{ paddingTop: "6px", paddingBottom: "6px" }} sizes={[16, 16, 15, 15, 14]} fontWeight={500} fontFamily={"Poppins"} />
                                        </Button>
                                        :
                                        <Button onClick={() => {
                                            validateForm() && (type === "notification_all_v1" && createNotificationCreative() || type === "in_page_all_v1" && createInPageCreative() || type === "new_tab_page_all_v1" && createNewTabPageCreative())
                                        }} style={{ marginLeft: "auto", marginTop: "28px" }}>
                                            <Text content={"Save"} style={{ paddingTop: "6px", paddingBottom: "6px" }} sizes={[16, 16, 15, 15, 14]} fontWeight={500} fontFamily={"Poppins"} />
                                        </Button>
                                }
                            </div>
                        </>
                    </Section>
                </div>
            </div>
        </>
    );
}

export default CreativeNew;