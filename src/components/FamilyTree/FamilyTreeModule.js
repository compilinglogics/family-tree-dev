import FamilyTree from "@balkangraph/familytree.js";

FamilyTree.templates.myTemplate = Object.assign({}, FamilyTree.templates.tommy);
FamilyTree.templates.myTemplate.size = [180, 250];
FamilyTree.templates.myTemplate.node = "";
FamilyTree.templates.myTemplate.nodeMenuButton = "";
FamilyTree.templates.myTemplate.html = "{val}";
FamilyTree.templates.myTemplate_male = Object.assign(
  {},
  FamilyTree.templates.myTemplate
);
FamilyTree.templates.myTemplate_female = Object.assign(
  {},
  FamilyTree.templates.myTemplate
);
FamilyTree.templates.myTemplate_non_binary = Object.assign(
  {},
  FamilyTree.templates.myTemplate
);

const BASE_URL = import.meta.env.VITE_API_URL;

const common = (args) => {
  const verifiedArgs = {
    gender: args.gender || "unknown",
    image_url: args.profileImageUrl || "public/default_avatar.png",
    fullname: args.fullName || "Unknown",
    dob: args.dob ? new Date(args.dob) : null,
    tag: args.tags?.[0] || "",
    city: args.city || "unknown",
    country: args.country || "unknown",
    id: args.id || "",
    isLinked: args.isLinked || false,
    isCurrent: args.isCurrent || false,
    highlighted: args.highlighted || false,
    prevPartner: args.prevPartner,
    nextPartner: args.nextPartner,
    prevChildren: args.prevChildren,
    nextChildren: args.nextChildren,
    paginateChildren: args.paginateChildren,
    prevIdx: args.prevIdx,
    nextIdx: args.nextIdx,
    childrenLen: args.childrenLen,
  };

  if (verifiedArgs.id === verifiedArgs.prevPartner) {
    verifiedArgs.prevPartner = undefined;
  }

  if (verifiedArgs.id === verifiedArgs.nextPartner) {
    verifiedArgs.nextPartner = undefined;
  }

  const isPrevDisabled = verifiedArgs.prevIdx < 0;
  const isNextDisabled = verifiedArgs.nextIdx >= verifiedArgs.childrenLen;

  const getVerifiedYear = () => {
    return verifiedArgs.dob instanceof Date && !isNaN(verifiedArgs.dob)
      ? verifiedArgs.dob.getFullYear()
      : "Undefined";
  };

  const html = `
  <foreignobject  x="0" y="0" width="180" height="250">
<div class="family-node ${verifiedArgs.tag} ${verifiedArgs.gender} ${
    verifiedArgs.isCurrent ? "current" : ""
  } ${verifiedArgs.highlighted ? "highlighted" : ""} ${
    verifiedArgs.isLinked ? "linked" : ""
  }">
  <div class="image-container">
      <img src="${
    verifiedArgs.image_url
  }" alt="Profile Image" class="profile-img" />
  </div>
  <div class="name">
      <p>${verifiedArgs.fullname.length > 12 ? verifiedArgs.fullname.substring(0, 12) + "..." : verifiedArgs.fullname}</p>
      <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.11274 16.5L4.64216 14.0686L1.87745 13.4412L2.13235 10.6176L0.25 8.5L2.13235 6.38235L1.87745 3.55882L4.64216 2.93137L6.11274 0.5L8.72059 1.61765L11.3284 0.5L12.799 2.93137L15.5637 3.55882L15.3088 6.38235L17.1912 8.5L15.3088 10.6176L15.5637 13.4412L12.799 14.0686L11.3284 16.5L8.72059 15.3824L6.11274 16.5ZM7.72059 11.3235L12.3873 6.67647L11.3873 5.67647L7.72059 9.32353L6.05392 7.67647L5.05392 8.67647L7.72059 11.3235Z" fill="#00B147"/>
      </svg>
  </div>

  <div class="year">
  <p style="color: ${verifiedArgs.isLinked ? 'black' : ''};">
    ${getVerifiedYear()}, ${verifiedArgs.city}
  </p>
</div>
<div class="country">
  <p style="color: ${verifiedArgs.isLinked ? 'black' : ''};">
    ${verifiedArgs.country}
  </p>
</div>
  ${
    verifiedArgs.prevPartner !== undefined ||
    verifiedArgs.nextPartner !== undefined
      ? ` <div class="pagination">
    <!-- Previous Button -->
    <button class="prev-button ${
      verifiedArgs.prevPartner !== undefined ? "" : "disabled"
    }" onclick="handlePrev('')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>

    <!-- Next Button -->
    <button class="next-button ${
      verifiedArgs.nextPartner !== undefined ? "" : "disabled"
    }" onclick="handleNext('')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19L16 12L9 5" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
</div>`
      : ""
  }
  ${
    verifiedArgs.id === verifiedArgs.prevChildren
      ? ` <div class="pagination">
      <!-- Previous Button -->
     <button class="prev-button ${isPrevDisabled ? "disabled" : ""}" ${
          isPrevDisabled ? "disabled" : ""
        } onclick="${isPrevDisabled ? "" : "handlePrevPage()"}">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 19L8 12L15 5" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>
  </div>`
      : ""
  }
  ${
    verifiedArgs.id === verifiedArgs.nextChildren
      ? ` <div class="pagination">
      <!-- Next Button -->
     <button class="next-button ${isNextDisabled ? "disabled" : ""}" ${
          isNextDisabled ? "disabled" : ""
        } onclick="${isNextDisabled ? "" : "handleNextPage()"}">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 19L16 12L9 5" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>
  </div>`
      : ""
  }
  ${
    verifiedArgs.isCurrent
      ? '<span class="add-icon" onclick="handleAdd(\'' + verifiedArgs.id +'\')" onTouchStart="handleAdd(\'' + verifiedArgs.id +'\')"><svg width="25" height="24" x="68" y="168" text-anchor="start" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.2207 0C5.6087 0 0.220703 5.388 0.220703 12C0.220703 18.612 5.6087 24 12.2207 24C18.8327 24 24.2207 18.612 24.2207 12C24.2207 5.388 18.8327 0 12.2207 0ZM17.0207 12.9H13.1207V16.8C13.1207 17.292 12.7127 17.7 12.2207 17.7C11.7287 17.7 11.3207 17.292 11.3207 16.8V12.9H7.4207C6.9287 12.9 6.5207 12.492 6.5207 12C6.5207 11.508 6.9287 11.1 7.4207 11.1H11.3207V7.2C11.3207 6.708 11.7287 6.3 12.2207 6.3C12.7127 6.3 13.1207 6.708 13.1207 7.2V11.1H17.0207C17.5127 11.1 17.9207 11.508 17.9207 12C17.9207 12.492 17.5127 12.9 17.0207 12.9Z" fill="#00B147"/></svg></span>'
      : ""
  }
  <div class="menu-icon" onclick="handleMenuClick('${verifiedArgs.id}')" onTouchStart="handleMenuClick('${verifiedArgs.id}')">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
  </div>
  </div>
</foreignobject>
  `;
  return html;
};

export { FamilyTree, common };