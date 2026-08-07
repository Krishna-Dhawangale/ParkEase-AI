const fs = require('fs');

const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8').replace(/\r\n/g, '\n');

const toReplace = `                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>`;

const replacement = `                  ))}
                </div>
              </div>
            </div>
          </div>`;

if (dtContent.includes(toReplace)) {
  dtContent = dtContent.replace(toReplace, replacement);
  fs.writeFileSync(dtPath, dtContent, 'utf8');
  console.log('Fixed divs!');
} else {
  // Let's try replacing multiple 10-space divs
  const fallbackReplace = `          </div>\n          </div>\n\n          <FloorNavigator`;
  const fallbackReplacement = `          </div>\n\n          <FloorNavigator`;
  if (dtContent.includes(fallbackReplace)) {
    dtContent = dtContent.replace(fallbackReplace, fallbackReplacement);
    fs.writeFileSync(dtPath, dtContent, 'utf8');
    console.log('Fixed divs using fallback!');
  } else {
    console.log('Could not find the target strings');
  }
}
