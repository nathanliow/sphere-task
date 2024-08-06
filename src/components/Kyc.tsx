import React, { useState } from 'react';
import Button from '@/components/Button';
import { getAuth } from 'firebase/auth';

// icons
import Loading from "@/components/Loading";
import { HiOutlineIdentification } from "react-icons/hi2";
import { CiCamera } from "react-icons/ci";
import { FaChevronLeft } from 'react-icons/fa';
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import LiveCaptureModal from '@/components/LiveCaptureModal';

const Kyc = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [webcamActive, setWebcamActive] = useState(false);
    const [country, setCountry] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [provideIdDocument, setProvideIdDocument] = useState(false);
    const [provideSelfie, setProvideSelfie] = useState(false);

    const handleNext = () => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    };

    const handlePrev = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
    };

    const handleOpenModal = () => {
        setWebcamActive(true);
    };

    const handleCountryChange = (event: any) => {
        setCountry(event.target.value);
    };

    const handleDocumentTypeChange = (event: any) => {
        setDocumentType(event.target.value);
    };

    const handleCapture = async (frontImageSrc: string | null, backImageSrc: string | null) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user || !user.email) {
                console.error(`User not authenticated or doesn't have email`);
                return;
            }

            if (!frontImageSrc || !backImageSrc) {
                console.error(`frontImageSrc or backImageSrc null`);
                return;
            }

            const addDocType = currentStep == 2 ? documentType : 'SELFIE';

            if (addDocType == documentType) {
                setProvideIdDocument(true);
            }

            try {
                if (frontImageSrc) {
                    const response = await fetch('/api/addDocument', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            userId: user.email, 
                            documentImage: frontImageSrc, 
                            documentType: addDocType,
                            documentSide: 'FRONT_SIDE',
                            country: country,
                        }),
                    });
        
                    if (!response.ok) {
                        throw new Error('Failed to add front side document');
                    }
                }

                if (backImageSrc) {
                    const response = await fetch('/api/addDocument', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            userId: user.email, 
                            documentImage: backImageSrc, 
                            documentType: addDocType,
                            documentSide: 'BACK_SIDE',
                            country: country,
                        }),
                    });
        
                    if (!response.ok) {
                        throw new Error('Failed to add back side document');
                    }
                }
                
            } catch (error) {
                console.error(error);
            }
            

            setWebcamActive(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.email) {
            console.error(`User not authenticated or doesn't have email`);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageSrc = reader.result as string;
            const addDocType = currentStep === 2 ? documentType : 'SELFIE';

            if (addDocType == 'SELFIE') {
                setProvideSelfie(true);
            }

            try {
                const response = await fetch('/api/addDocument', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        userId: user.email, 
                        documentImage: imageSrc, 
                        documentType: addDocType,
                        country: country,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add document');
                }
            } catch (error) {
                console.error(error);
            }
        };
        reader.readAsDataURL(file);
    };

    const steps = [
        {
            title: 'Verification for Sphere Labs',
            content: (
                <div className="flex flex-col justify-center items-center gap-8">
                    <div className="text-black text-md font-bold w-3/4">
                        You’re about to submit sensitive data to Sphere Labs. 
                        If you received this link from a suspicious source, 
                        please close this page and notify us immediately.
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-hor gap-4">
                            <div className="flex items-center justify-center bg-light-gray rounded-full p-2">
                                <HiOutlineIdentification size={40}/>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-dark-gray text-md font-bold">Step 1</div>
                                <div className="text-black text-md">Provide identity document</div>
                            </div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <div className="flex items-center justify-center bg-light-gray rounded-full p-2">
                                <CiCamera size={40} />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-dark-gray text-md font-bold">Step 2</div>
                                <div className="text-black text-md">Perform a liveness check with a selfie</div>
                            </div>
                        </div>
                    </div>
                </div>        
            ),
        },
        {
            title: 'Select type and issuing country of your identity document',
            content: (
                <div className="flex flex-col justify-center items-left gap-8">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="country-select" className="text-black text-md font-bold">Issuing Country</label>
                        <select id="country-select" value={country} onChange={handleCountryChange} className="bg-light-gray p-2 rounded-[10px]">
                            <option value="">Select a country</option>
                            <option value="AFG">Afghanistan</option>
                            <option value="ALB">Albania</option>
                            <option value="DZA">Algeria</option>
                            <option value="ASM">American Samoa</option>
                            <option value="AND">Andorra</option>
                            <option value="AGO">Angola</option>
                            <option value="AIA">Anguilla</option>
                            <option value="ATG">Antigua and Barbuda</option>
                            <option value="ARG">Argentina</option>
                            <option value="ARM">Armenia</option>
                            <option value="ABW">Aruba</option>
                            <option value="AUS">Australia</option>
                            <option value="AUT">Austria</option>
                            <option value="AZE">Azerbaijan</option>
                            <option value="BHR">Bahrain</option>
                            <option value="BGD">Bangladesh</option>
                            <option value="BRB">Barbados</option>
                            <option value="BLR">Belarus</option>
                            <option value="BEL">Belgium</option>
                            <option value="BLZ">Belize</option>
                            <option value="BEN">Benin</option>
                            <option value="BMU">Bermuda</option>
                            <option value="BTN">Bhutan</option>
                            <option value="BOL">Bolivia</option>
                            <option value="BIH">Bosnia and Herzegovina</option>
                            <option value="BWA">Botswana</option>
                            <option value="BRA">Brazil</option>
                            <option value="VGB">British Virgin Islands</option>
                            <option value="BRU">Brunei</option>
                            <option value="BGR">Bulgaria</option>
                            <option value="BFA">Burkina Faso</option>
                            <option value="BDI">Burundi</option>
                            <option value="KHM">Cambodia</option>
                            <option value="CMR">Cameroon</option>
                            <option value="CDN">Canada</option>
                            <option value="CPV">Cape Verde</option>
                            <option value="CYM">Cayman Islands</option>
                            <option value="RCA">Central African Republic</option>
                            <option value="TCD">Chad</option>
                            <option value="RCH">Chile</option>
                            <option value="CHN">China</option>
                            <option value="COL">Colombia</option>
                            <option value="COM">Comoros</option>
                            <option value="COK">Cook Islands</option>
                            <option value="CRI">Costa Rica </option>
                            <option value="HRV">Croatia</option>
                            <option value="CUB">Cuba</option>
                            <option value="CUW">Curaçao</option>
                            <option value="CYP">Cyprus</option>
                            <option value="CZE">Czechia</option>
                            <option value="COD">Democratic Republic of the Congo</option>
                            <option value="DNK">Denmark</option>
                            <option value="DJI">Djibouti</option>
                            <option value="DMA">Dominica</option>
                            <option value="DOM">Dominican Republic</option>
                            <option value="ECU">Ecuador</option>
                            <option value="EGY">Egypt</option>
                            <option value="SLV">El Salvador</option>
                            <option value="GNQ">Equatorial Guinea</option>
                            <option value="ERI">Eritrea</option>
                            <option value="EST">Estonia</option>
                            <option value="ETH">Ethiopia</option>
                            <option value="FRO">Faroe Islands</option>
                            <option value="FSM">Federated States of Micronesia</option>
                            <option value="FJI">Fiji</option>
                            <option value="FIN">Finland</option>
                            <option value="FRA">France</option>
                            <option value="GUF">French Guiana</option>
                            <option value="PYF">French Polynesia</option>
                            <option value="GAB">Gabon</option>
                            <option value="GEO">Georgia</option>
                            <option value="DEU">Germany</option>
                            <option value="GHA">Ghana</option>
                            <option value="GIB">Gibraltar</option>
                            <option value="GRC">Greece</option>
                            <option value="GRL">Greenland</option>
                            <option value="GRD">Grenada</option>
                            <option value="GLP">Guadeloupe</option>
                            <option value="GUM">Guam</option>
                            <option value="GTM">Guatemala</option>
                            <option value="GGY">Guernsey</option>
                            <option value="GIN">Guinea</option>
                            <option value="GUY">Guyana</option>
                            <option value="HTI">Haiti</option>
                            <option value="VAT">Holy See (Vatican City)</option>
                            <option value="HND">Honduras</option>
                            <option value="HKG">Hong Kong</option>
                            <option value="HUN">Hungary</option>
                            <option value="ISL">Iceland</option>
                            <option value="IND">India</option>
                            <option value="IDN">Indonesia</option>
                            <option value="IRN">Iran</option>
                            <option value="IRQ">Iraq</option>
                            <option value="IRL">Ireland</option>
                            <option value="IMN">Isle of Man</option>
                            <option value="ISR">Israel</option>
                            <option value="ITA">Italy</option>
                            <option value="JAM">Jamaica</option>
                            <option value="JPN">Japan</option>
                            <option value="JEY">Jersey</option>
                            <option value="JOR">Jordan</option>
                            <option value="KAZ">Kazakhstan</option>
                            <option value="KEN">Kenya</option>
                            <option value="KIR">Kiribati</option>
                            <option value="KWT">Kuwait</option>
                            <option value="KGZ">Kyrgyzstan</option>
                            <option value="LAO">Laos</option>
                            <option value="LVA">Latvia</option>
                            <option value="LBN">Lebanon</option>
                            <option value="LSO">Lesotho</option>
                            <option value="LBR">Liberia</option>
                            <option value="LBY">Libya</option>
                            <option value="LIE">Liechtenstein</option>
                            <option value="LTU">Lithuania</option>
                            <option value="LUX">Luxembourg</option>
                            <option value="MAC">Macau</option>
                            <option value="MDG">Madagascar</option>
                            <option value="MWI">Malawi</option>
                            <option value="MYS">Malaysia</option>
                            <option value="MDV">Maldives</option>
                            <option value="MLI">Mali</option>
                            <option value="MLT">Malta</option>
                            <option value="MHL">Marshall Islands</option>
                            <option value="MTQ">Martinique</option>
                            <option value="MRT">Mauritania</option>
                            <option value="MUS">Mauritius</option>
                            <option value="MYT">Mayotte</option>
                            <option value="MEX">Mexico</option>
                            <option value="MDA">Moldova</option>
                            <option value="MCO">Monaco</option>
                            <option value="MNG">Mongolia</option>
                            <option value="MNE">Montenegro</option>
                            <option value="MSR">Montserrat</option>
                            <option value="MAR">Morocco</option>
                            <option value="MOZ">Mozambique</option>
                            <option value="MMR">Myanmar (Burma)</option>
                            <option value="NAM">Namibia</option>
                            <option value="NRU">Nauru</option>
                            <option value="NPL">Nepal</option>
                            <option value="NLD">Netherlands</option>
                            <option value="NCL">New Caledonia</option>
                            <option value="NZL">New Zealand</option>
                            <option value="NIC">Nicaragua</option>
                            <option value="NER">Niger</option>
                            <option value="NGA">Nigeria</option>
                            <option value="NIU">Niue</option>
                            <option value="MKD">North Macedonia</option>
                            <option value="MNP">Northern Mariana Islands</option>
                            <option value="NOR">Norway</option>
                            <option value="OMN">Oman</option>
                            <option value="PAK">Pakistan</option>
                            <option value="PLW">Palau</option>
                            <option value="PSE">Palestinian Territory</option>
                            <option value="PNG">Papua New Guinea</option>
                            <option value="PRY">Paraguay</option>
                            <option value="PER">Peru</option>
                            <option value="PHL">Philippines</option>
                            <option value="PCN">Pitcairn Islands</option>
                            <option value="POL">Poland</option>
                            <option value="PRT">Portugal</option>
                            <option value="PRI">Puerto Rico</option>
                            <option value="QAT">Qatar</option>
                            <option value="XKK">Republic of Kosovo</option>
                            <option value="RCB">Republic of the Congo</option>
                            <option value="REU">Reunion</option>
                            <option value="ROU">Romania</option>
                            <option value="RUS">Russia</option>
                            <option value="RWA">Rwanda</option>
                            <option value="BLM">Saint Barthélemy</option>
                            <option value="SHN">Saint Helena</option>
                            <option value="KNA">Saint Kitts and Nevis</option>
                            <option value="LCA">Saint Lucia</option>
                            <option value="MAF">Saint Martin</option>
                            <option value="SPM">Saint Pierre and Miquelon</option>
                            <option value="VCT">Saint Vincent and the Grenadines</option>
                            <option value="RSM">San Marino</option>
                            <option value="STP">Sao Tome and Principe</option>
                            <option value="SAU">Saudi Arabia</option>
                            <option value="SEN">Senegal</option>
                            <option value="SRB">Serbia</option>
                            <option value="SYC">Seychelles</option>
                            <option value="WAL">Sierra Leone</option>
                            <option value="SGP">Singapore</option>
                            <option value="SXM">Sint Maarten</option>
                            <option value="SVK">Slovakia</option>
                            <option value="SVN">Slovenia</option>
                            <option value="SLB">Solomon Islands</option>
                            <option value="SOM">Somalia</option>
                            <option value="ZAF">South Africa</option>
                            <option value="KOR">South Korea</option>
                            <option value="SSD">South Sudan</option>
                            <option value="ESP">Spain</option>
                            <option value="LKA">Sri Lanka </option>
                            <option value="SDN">Sudan</option>
                            <option value="SUR">Suriname</option>
                            <option value="SWE">Sweden</option>
                            <option value="CHE">Switzerland</option>
                            <option value="SYR">Syria</option>
                            <option value="TWN">Taiwan</option>
                            <option value="TJK">Tajikistan</option>
                            <option value="TZA">Tanzania</option>
                            <option value="THA">Thailand</option>
                            <option value="BHS">The Bahamas</option>
                            <option value="GMB">Gambia</option>
                            <option value="TGO">Togo</option>
                            <option value="TON">Tonga</option>
                            <option value="TTO">Trinidad and Tobago</option>
                            <option value="TUN">Tunisia</option>
                            <option value="TUR">Turkey</option>
                            <option value="TMN">Turkmenistan</option>
                            <option value="TCA">Turks and Caicos Islands</option>
                            <option value="TUV">Tuvalu</option>
                            <option value="UGA">Uganda</option>
                            <option value="UKR">Ukraine</option>
                            <option value="ARE">United Arab Emirates</option>
                            <option value="GBR">United Kingdom</option>
                            <option value="USA">United States of America</option>
                            <option value="URY">Uruguay</option>
                            <option value="UZB">Uzbekistan</option>
                            <option value="VUT">Vanuatu</option>
                            <option value="VEN">Venezuela</option>
                            <option value="VNM">Vietnam</option>
                            <option value="VIR">Virgin Islands</option>
                            <option value="WLF">Wallis and Futuna </option>
                            <option value="WSM">Western Samoa</option>
                            <option value="YEM">Yemen</option>
                            <option value="ZMB">Zambia</option>
                            <option value="ZWE">Zimbabwe</option>
                            <option value="ALA">Åland Islands</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-black text-md font-bold">Document Type</label>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center justify-between gap-2 cursor-pointer bg-light-gray rounded-[10px] px-4 py-2">                              
                                <div>ID Card</div>
                                <input
                                    type="radio"
                                    name="documentType"
                                    value="ID_CARD"
                                    checked={documentType === 'ID_CARD'}
                                    onChange={handleDocumentTypeChange}
                                    className="hidden"
                                />
                                <div className={`flex justify-center items-center w-4 h-4 rounded-full border border-gray bg-white`}>
                                    <div className={`w-3 h-3 rounded-full ${documentType === 'ID_CARD' ? 'bg-blue' : 'bg-white'}`}/>
                                </div>
                            </label>
                            <label className="flex items-center justify-between gap-2 cursor-pointer bg-light-gray rounded-[10px] px-4 py-2">                              
                                <div>Passport</div>
                                <input
                                    type="radio"
                                    name="documentType"
                                    value="PASSPORT"
                                    checked={documentType === 'PASSPORT'}
                                    onChange={handleDocumentTypeChange}
                                    className="hidden"
                                />
                                <div className={`flex justify-center items-center w-4 h-4 rounded-full border border-gray bg-white`}>
                                    <div className={`w-3 h-3 rounded-full ${documentType === 'PASSPORT' ? 'bg-blue' : 'bg-white'}`}/>
                                </div>
                            </label>
                            <label className="flex items-center justify-between gap-2 cursor-pointer bg-light-gray rounded-[10px] px-4 py-2">                              
                                <div>Driver's License</div>
                                <input
                                    type="radio"
                                    name="documentType"
                                    value="DRIVERS"
                                    checked={documentType === 'DRIVERS'}
                                    onChange={handleDocumentTypeChange}
                                    className="hidden"
                                />
                                <div className={`flex justify-center items-center w-4 h-4 rounded-full border border-gray bg-white`}>
                                    <div className={`w-3 h-3 rounded-full ${documentType === 'DRIVERS' ? 'bg-blue' : 'bg-white'}`}/>
                                </div>
                            </label>
                            <label className="flex items-center justify-between gap-2 cursor-pointer bg-light-gray rounded-[10px] px-4 py-2">                              
                                <div>Residence Permit</div>
                                <input
                                    type="radio"
                                    name="documentType"
                                    value="RESIDENCE_PERMIT"
                                    checked={documentType === 'RESIDENCE_PERMIT'}
                                    onChange={handleDocumentTypeChange}
                                    className="hidden"
                                />
                                <div className={`flex justify-center items-center w-4 h-4 rounded-full border border-gray bg-white`}>
                                    <div className={`w-3 h-3 rounded-full ${documentType === 'RESIDENCE_PERMIT' ? 'bg-blue' : 'bg-white'}`}/>
                                </div>                                
                            </label>
                        </div>
                    </div>
                </div>        
            ),
        },
        {
            title: 'Provide your identity document',
            content: (
                <div className="flex flex-col justify-center items-center gap-6">
                    <div className="flex flex-hor gap-6">
                        <div className="flex flex-col items-center border-2 border-gray p-12 rounded-[20px] cursor-pointer hover:bg-hover-white" onClick={handleOpenModal}>
                            <CiCamera size={40} />
                            <div className="text-black text-sm font-bold">Take a photo</div>
                        </div>
                        <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
                            <div className="flex flex-col items-center border-2 border-gray p-12 rounded-[20px] hover:bg-hover-white">
                                    <MdOutlineFileUpload size={40} />
                                    <div className="text-black text-sm font-bold">Upload a file</div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                            </div>
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="text-black text-md font-bold">Tips</div>
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Upload a colored photo or file</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Take a photo in a well lit room</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCloseCircleOutline size={24} color={'red'}/>
                            <div className="text-black text-md">Don't edit images of your document</div>
                        </div>
                    </div>
                </div>     
            ),
        },
        {
            title: 'Upload a selfie',
            content: (
                <div className="flex flex-col justify-center items-center gap-6">
                    <div className="flex flex-col items-center border-2 border-gray p-12 rounded-[20px] cursor-pointer hover:bg-hover-white" onClick={handleOpenModal}>
                        <CiCamera size={40} />
                        <div className="text-black text-sm font-bold">Take a photo</div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="text-black text-md font-bold">Tips</div>
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Find a well lit place</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Ensure your face is within the frame</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCloseCircleOutline size={24} color={'red'}/>
                            <div className="text-black text-md">Don't wear hats, glasses, and masks</div>
                        </div>
                    </div>
                </div> 
            ),
        },
        {
            title: 'We are processing your data',
            content: (
                <div className="flex flex-col justify-center items-center gap-8">
                     <Loading size={40}/>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Identification</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCheckmarkCircleOutline size={24} color={'lime'}/>
                            <div className="text-black text-md">Selfie</div>
                        </div>
                        <div className="flex flex-hor gap-4">
                            <IoCloseCircleOutline size={24} color={'red'}/>
                            <div className="text-black text-md">Finish</div>
                        </div>
                    </div>
                </div> 
            ),
        },
    ];

    return (
        <div className="w-full h-full">
            {/* progress bars */}

            <div className="flex flex-col relative items-center border-2 border-gray p-8 rounded-[20px] gap-10">
                {currentStep > 0 && (
                    <FaChevronLeft
                        onClick={handlePrev}
                        className="absolute top-8 left-8 text-xl cursor-pointer"
                    />
                )}
                <div className="text-black text-xl font-bold">{steps[currentStep].title}</div>
                <div>{steps[currentStep].content}</div>

                {currentStep < steps.length - 1 && (<div className="flex flex-col justify-center w-1/2">
                    <Button 
                        variant="secondary" 
                        onClick={handleNext} 
                        disabled={
                            (currentStep === 1 && (!country || !documentType)) ||
                            (currentStep === 2 && !provideIdDocument) ||
                            (currentStep === 3 && !provideSelfie)
                        }    
                    >
                        Continue
                    </Button>
                </div>)}

                <LiveCaptureModal
                    isActive={webcamActive}
                    onCapture={handleCapture}
                    onCancel={() => setWebcamActive(false)}
                />

            </div>
        </div>
        
    );
};

export default Kyc;
