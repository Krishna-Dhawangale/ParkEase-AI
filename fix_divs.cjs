const fs = require('fs');

const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

// The file currently has too many closing divs around line 970.
// Let's find the minimap block in DigitalTwin.tsx and count the closing divs.
const minimapMatch = dtContent.indexOf('background: item.stroke }}');
if (minimapMatch !== -1) {
  // Let's replace the excess closing divs
  // The correct sequence after background: item.stroke }} should be:
  //                      />
  //                    ))}
  //                  </div>
  //                </div>
  //              </div>
  //          </div>
  
  // Wait, in DigitalTwin.tsx right now, it has:
  //                  ))}
  //                </div>
  //              </div>
  //            </div>
  //          </div>
  //          </div>
  
  // We want to replace 5 closing divs with 4 closing divs!
  // Wait! Let's just use regex to clean it up!
  const excessRegex = /                  \}\}\)\}\r?\n                <\/div>\r?\n              <\/div>\r?\n            <\/div>\r?\n          <\/div>\r?\n          <\/div>/;
  const replacement = `                  ))}\n                </div>\n              </div>\n            </div>\n          </div>`;
  
  dtContent = dtContent.replace(excessRegex, replacement);
  fs.writeFileSync(dtPath, dtContent, 'utf8');
  console.log('Fixed excess closing divs');
} else {
  console.log('Minimap not found');
}
