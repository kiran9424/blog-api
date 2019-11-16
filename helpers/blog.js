exports.smartTrim = (body,numberOfCharacters,delim,appendix)=>{
    if(body.length <= numberOfCharacters ) return body;

    var trimmedBody = body.substr(0,numberOfCharacters + delim.length);
    var lastDelimIndex = trimmedBody.lastIndexOf(delim);

    if(lastDelimIndex >= 0) trimmedBody = trimmedBody.substr(0,lastDelimIndex);
    if(trimmedBody) trimmedBody += appendix;

    return trimmedBody;
}