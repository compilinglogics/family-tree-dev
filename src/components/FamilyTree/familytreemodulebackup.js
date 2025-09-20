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

// -------------------------------
// Helper to inject partner pagination
// -------------------------------
export const enrichRelatives = (response) => {
  const relatives = response.relatives || [];

  // add partner pagination info from response
  if (response.partnerId || response.nextPartnerId) {
    relatives.forEach((r) => {
      if (r._id === response.partnerId) {
        r.prevPartner = response.partnerId; // mark current partner
      }
      if (r._id === response.nextPartnerId) {
        r.nextPartner = response.nextPartnerId; // mark next partner
      }
    });
  }

  return relatives.map((r) => ({
    ...r,
    id: r._id,
  }));
};

// -------------------------------
// Node HTML Builder
// -------------------------------
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
  };

  const getVerifiedYear = () => {
    return verifiedArgs.dob instanceof Date && !isNaN(verifiedArgs.dob)
      ? verifiedArgs.dob.getFullYear()
      : "Undefined";
  };

  const html = `
  <foreignobject x="0" y="0" width="180" height="250">
    <div class="family-node ${verifiedArgs.tag} ${verifiedArgs.gender} 
      ${verifiedArgs.isCurrent ? "current" : ""} 
      ${verifiedArgs.highlighted ? "highlighted" : ""} 
      ${verifiedArgs.isLinked ? "linked" : ""}">
      
      <div class="family-inner">
        <div class="image-container">
          <img src="${verifiedArgs.image_url}" alt="Profile Image" class="profile-img" />
        </div>

        <div class="name">
          <p>${
            verifiedArgs.fullname.length > 12
              ? verifiedArgs.fullname.substring(0, 12) + "..."
              : verifiedArgs.fullname
          }</p>
        </div>

        <div class="year">
          <p style="color: ${verifiedArgs.isLinked ? "black" : ""};">
            ${getVerifiedYear()}, ${verifiedArgs.city}
          </p>
        </div>

        <div class="country">
          <p style="color: ${verifiedArgs.isLinked ? "black" : ""};">
            ${verifiedArgs.country}
          </p>
        </div>

        <!-- Partner Pagination -->
        ${
          verifiedArgs.prevPartner || verifiedArgs.nextPartner
            ? `
          <div class="pagination">
            <!-- Prev -->
            <div class="pag-btn">
            <button class="prev-button ${
              verifiedArgs.prevPartner ? "" : "disabled"
            }"
              ${
                verifiedArgs.prevPartner
                  ? `onclick="handlePrev('${verifiedArgs.prevPartner}')"`
                  : "disabled"
              }>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M15 19L8 12L15 5" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            </div>

            <!-- Next -->
            <div class="pag-btn">
            <button class="next-button ${
              verifiedArgs.nextPartner ? "" : "disabled"
            }"
              ${
                verifiedArgs.nextPartner
                  ? `onclick="handleNext('${verifiedArgs.nextPartner}')"`
                  : "disabled"
              }>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M9 19L16 12L9 5" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            </div>
          </div>
          `
            : ""
        }

        ${
          verifiedArgs.isCurrent
          ? '<span class="add-icon pb-2" onclick="handleAdd(\'' + verifiedArgs.id +'\')" onTouchStart="handleAdd(\'' + verifiedArgs.id +'\')"><svg width="25" height="24" x="68" y="168" text-anchor="start" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.2207 0C5.6087 0 0.220703 5.388 0.220703 12C0.220703 18.612 5.6087 24 12.2207 24C18.8327 24 24.2207 18.612 24.2207 12C24.2207 5.388 18.8327 0 12.2207 0ZM17.0207 12.9H13.1207V16.8C13.1207 17.292 12.7127 17.7 12.2207 17.7C11.7287 17.7 11.3207 17.292 11.3207 16.8V12.9H7.4207C6.9287 12.9 6.5207 12.492 6.5207 12C6.5207 11.508 6.9287 11.1 7.4207 11.1H11.3207V7.2C11.3207 6.708 11.7287 6.3 12.2207 6.3C12.7127 6.3 13.1207 6.708 13.1207 7.2V11.1H17.0207C17.5127 11.1 17.9207 11.508 17.9207 12C17.9207 12.492 17.5127 12.9 17.0207 12.9Z" fill="#00B147"/></svg></span>'
          : ""
        }

        <div class="menu-icon" onclick="handleMenuClick('${verifiedArgs.id}')">
          <div class="dot"></div><div class="dot"></div><div class="dot"></div>
        </div>
      </div>
    </div>
  </foreignobject>`;

  return html;
};

export { FamilyTree, common };
